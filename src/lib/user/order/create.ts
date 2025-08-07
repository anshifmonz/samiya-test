import { supabaseAdmin } from 'lib/supabase';
import { CreateOrderResponse, OrderSummary } from 'types/order';
import { reserveStock, releaseStock, consumeReservations } from './reserveStock';

export async function createOrder(
  userId: string,
  checkoutId: string,
  shippingAddressId?: string,
  paymentMethod?: string
): Promise<CreateOrderResponse> {
  try {
    if (!userId || typeof userId !== 'string') return { success: false, error: 'User ID is required and must be a string', status: 400 };
    if (!checkoutId || typeof checkoutId !== 'string') return { success: false, error: 'Checkout ID is required and must be a string', status: 400 };

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
        return { success: false, error: 'Checkout session not found or already processed', status: 404 };
      throw new Error(`Database error: ${checkoutError.message}`);
    }

    if (new Date(checkout.expires_at + 'Z').getTime() < Date.now())
      return { success: false, error: 'Checkout session has expired', status: 400 };

    const { data: checkoutItems, error: itemsError } = await supabaseAdmin
      .from('checkout_items')
      .select(`
        id,
        product_id,
        color_id,
        size_id,
        product_title,
        product_price,
        quantity,
        products:product_id (
          primary_image_url,
          is_active
        ),
        product_colors:color_id (
          color_name,
          hex_code
        ),
        sizes:size_id (
          name
        )
      `)
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


    const totalAmount = checkoutItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

    const stockItems = checkoutItems.map(item => ({
      product_id: item.product_id,
      color_id: item.color_id,
      size_id: item.size_id,
      quantity: item.quantity
    }));

    const stockReservation = await reserveStock(stockItems, 15, checkoutId);
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
      shipping_address_id: shippingAddressId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select('id, created_at')
      .single();

    if (orderError) {
      if (stockReservation.reservations)
        await releaseStock(stockReservation.reservations);
      return { success: false, error: 'Failed to create order', status: 500 };
    }

    const orderItemsData = checkoutItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_title,
      quantity: item.quantity,
      final_price: item.product_price,
      created_at: new Date().toISOString()
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (orderItemsError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      if (stockReservation.reservations)
        await releaseStock(stockReservation.reservations);
      return { success: false, error: 'Failed to create order items', status: 500 };
    }

    const { error: updateCheckoutError } = await supabaseAdmin
      .from('checkout')
      .update({ status: 'processing' })
      .eq('id', checkoutId);

    if (updateCheckoutError)
      console.error('Error updating checkout status:', updateCheckoutError);

    // Mark stock reservations as consumed
    const consumeResult = await consumeReservations(checkoutId);
    if (!consumeResult.success) {
      console.error('Error consuming stock reservations:', consumeResult.error);
      // Note: We don't fail the order creation here as the order was successfully created
    }

    const orderSummary: OrderSummary = {
      orderId: order.id,
      total: totalAmount,
      itemCount: checkoutItems.length,
      items: checkoutItems.map(item => {
        const product = Array.isArray(item.products) ? item.products[0] : item.products;
        const color = Array.isArray(item.product_colors) ? item.product_colors[0] : item.product_colors;
        const size = Array.isArray(item.sizes) ? item.sizes[0] : item.sizes;

        return {
          productId: item.product_id,
          productTitle: item.product_title,
          quantity: item.quantity,
          unitPrice: item.product_price,
          totalPrice: item.product_price * item.quantity,
          color: color?.color_name,
          size: size?.name,
          image: product?.primary_image_url
        };
      }),
      status: 'pending',
      createdAt: order.created_at
    };

    return {
      success: true,
      data: {
        orderId: order.id,
        orderSummary
      }
    };

  } catch (error) {
    console.error('Error in createOrder:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}
