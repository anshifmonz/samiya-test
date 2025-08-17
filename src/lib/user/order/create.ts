import { supabaseAdmin } from 'lib/supabase';
import { type CreateOrderResponse } from 'types/order';
import { initiatePaymentSession } from 'lib/user/payment';
import { reserveStock, releaseStockReservations } from 'lib/inventory';

export async function createOrder(
  userId: string,
  checkoutId: string,
  shippingAddressId?: string,
  paymentMethod?: string
): Promise<CreateOrderResponse> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: false, error: 'User ID is required and must be a string', status: 400 };
    if (!checkoutId || typeof checkoutId !== 'string')
      return { success: false, error: 'Checkout ID is required and must be a string', status: 400 };
    if (paymentMethod && typeof paymentMethod !== 'string')
      return { success: false, error: 'Payment method must be a string', status: 400 };
    if (paymentMethod && !['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod))
      return { success: false, error: 'Invalid payment method', status: 400 };

    // get checkout data
    // verify it belongs to the user
    const { data: checkout, error: checkoutError } = await supabaseAdmin
      .from('checkout')
      .select('id, status, expires_at, created_at')
      .eq('id', checkoutId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (checkoutError) {
      if (checkoutError.code === 'PGRST116')
        return {
          success: false,
          error: 'Checkout session not found or already processed',
          status: 404
        };
      throw new Error(`Database error: ${checkoutError.message}`);
    }

    if (new Date(checkout.expires_at + 'Z').getTime() < Date.now())
      return { success: false, error: 'Checkout session has expired', status: 400 };

    const { data: checkoutItems, error: itemsError } = await supabaseAdmin
      .from('checkout_items')
      .select(
        `
        id,
        product_id,
        color_id,
        size_id,
        product_title,
        product_price,
        quantity,
        products:product_id (
          is_active
        ),
        product_color_sizes (
          stock_quantity
        )
      `
      )
      .eq('checkout_id', checkoutId);

    if (itemsError) throw new Error(`Database error: ${itemsError.message}`);

    if (!checkoutItems || checkoutItems.length === 0)
      return { success: false, error: 'No items found in checkout', status: 400 };

    // is all products are still active?
    const inactiveProducts = checkoutItems.filter(item => {
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      return !product?.is_active;
    });
    if (inactiveProducts.length > 0)
      return {
        success: false,
        error: 'Some products in your checkout are no longer available',
        status: 400
      };

    // is all products stock available?
    const outOfStockItems = checkoutItems.filter(item => {
      const stock = Array.isArray(item.product_color_sizes)
        ? item.product_color_sizes[0]
        : item.product_color_sizes;
      return stock?.stock_quantity < item.quantity;
    });
    if (outOfStockItems.length > 0)
      return {
        success: false,
        error: 'Some products in your checkout are out of stock',
        status: 400
      };

    const totalAmount = checkoutItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );

    const stockItems = checkoutItems.map(item => ({
      product_id: item.product_id,
      color_id: item.color_id,
      size_id: item.size_id,
      quantity: item.quantity
    }));

    const stockReservation = await reserveStock(stockItems, checkoutId, 15);
    if (!stockReservation.success)
      return {
        success: false,
        error: stockReservation.error || 'Failed to reserve stock',
        status: stockReservation.status || 400
      };

    const orderData = {
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      payment_method: paymentMethod || null,
      payment_status: 'unpaid',
      shipping_address_id: shippingAddressId || null
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select('id, created_at')
      .single();

    if (orderError) return { success: false, error: 'Failed to create order', status: 500 };

    const orderItemsData = checkoutItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_title,
      quantity: item.quantity,
      final_price: item.product_price
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (orderItemsError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      if (stockReservation.reservations)
        await releaseStockReservations(stockReservation.reservations);
      return { success: false, error: 'Failed to create order items', status: 500 };
    }

    const { error: updateCheckoutError } = await supabaseAdmin
      .from('checkout')
      .update({ status: 'processing' })
      .eq('id', checkoutId);

    if (updateCheckoutError) console.error('Error updating checkout status:', updateCheckoutError);

    // Attempt payment initiation if online payment (block if reservation has expired)
    let paymentDetails: {
      payment_session_id: string;
      cf_order_id: string;
      order_id: string;
      payment_url?: string;
    } | null = null;
    let paymentError: string | undefined;

    if (paymentMethod && paymentMethod !== 'cod') {
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const { body, status } = await initiatePaymentSession(
          userId,
          order.id,
          paymentMethod as any
        );
        if (status !== 200) {
          const errMsg = (body as any)?.error || 'Failed to initiate payment';
          if (attempt === maxAttempts) paymentError = errMsg;
          continue;
        }
        const data = (body as any).data as {
          payment_session_id: string;
          cf_order_id: string;
          order_id: string;
          payment_url?: string;
        };
        paymentDetails = data;
        break;
      }
    }

    return {
      success: true,
      data: {
        orderId: order.id,
        payment_required: paymentMethod !== 'cod',
        payment: paymentDetails,
        payment_error: paymentError
      }
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}
