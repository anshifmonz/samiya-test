import { supabaseAdmin } from 'lib/supabase';
import { GetOrderHistoryResponse, OrderHistory } from 'types/order';
import { generateOrderNumber, getOrderIndexForYear } from 'utils/orderUtils';

export async function getUserOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetOrderHistoryResponse> {
  try {
    if (!userId || typeof userId !== 'string') return { success: false, error: 'User ID is required and must be a string', status: 400 };
    if (page < 1) return { success: false, error: 'Page must be greater than 0', status: 400 };
    if (limit < 1 || limit > 100) return { success: false, error: 'Limit must be between 1 and 100', status: 400 };

    const offset = (page - 1) * limit;

    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw new Error(`Database error counting orders: ${countError.message}`);

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        payment_method,
        payment_status,
        created_at,
        updated_at,
        shiprocket_order_id,
        shiprocket_tracking_url,
        shiprocket_awb_code,
        addresses:shipping_address_id (
          id,
          label,
          full_name,
          phone,
          street,
          landmark,
          city,
          district,
          state,
          postal_code,
          country
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (ordersError) throw new Error(`Database error fetching orders: ${ordersError.message}`);

    if (!orders || orders.length === 0) {
      return {
        success: true,
        data: {
          orders: [],
          totalCount: totalCount || 0,
          page,
          limit
        }
      };
    }

    const orderIds = orders.map(order => order.id);
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(`
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        final_price,
        total_price,
        created_at,
        products:product_id (
          id,
          title,
          primary_image_url,
          short_code
        )
      `)
      .in('order_id', orderIds)
      .order('created_at', { ascending: true });

    if (itemsError) throw new Error(`Database error fetching order items: ${itemsError.message}`);

    // Group order items by order_id
    const itemsByOrderId = (orderItems || []).reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        final_price: item.final_price,
        total_price: item.total_price,
        created_at: item.created_at,
        product: Array.isArray(item.products) ? item.products[0] : item.products
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Combine orders with their items and shipping addresses
    const orderHistory: OrderHistory[] = orders.map((order, _) => {
      // generate order number based on creation date and position
      const orderIndex = getOrderIndexForYear(order.created_at, orders);
      const orderNumber = generateOrderNumber(order.created_at, orderIndex);

      return {
        id: order.id,
        user_id: order.user_id,
        order_number: orderNumber,
        total_amount: order.total_amount,
        status: order.status,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        created_at: order.created_at,
        updated_at: order.updated_at,
        shiprocket_order_id: (order as any).shiprocket_order_id || null,
        shiprocket_tracking_url: (order as any).shiprocket_tracking_url || null,
        shiprocket_awb_code: (order as any).shiprocket_awb_code || null,
        items: itemsByOrderId[order.id] || [],
        shipping_address: Array.isArray(order.addresses) ? order.addresses[0] : order.addresses
      };
    });

    return {
      success: true,
      data: {
        orders: orderHistory,
        totalCount: totalCount || 0,
        page,
        limit
      }
    };

  } catch (error) {
    console.error('Error in getUserOrders:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

export async function getUserOrderById(
  userId: string,
  orderId: string
): Promise<{ success: boolean; error?: string; status?: number; data?: OrderHistory }> {
  try {
    if (!userId || typeof userId !== 'string') return { success: false, error: 'User ID is required and must be a string', status: 400 };
    if (!orderId || typeof orderId !== 'string') return { success: false, error: 'Order ID is required and must be a string', status: 400 };

    // Get specific order with shipping address
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        payment_method,
        payment_status,
        created_at,
        updated_at,
        shiprocket_order_id,
        shiprocket_tracking_url,
        shiprocket_awb_code,
        addresses:shipping_address_id (
          id,
          label,
          full_name,
          phone,
          street,
          landmark,
          city,
          district,
          state,
          postal_code,
          country
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116')
        return { success: false, error: 'Order not found', status: 404 };
      throw new Error(`Database error fetching order: ${orderError.message}`);
    }

    // Get order items with product details
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(`
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        final_price,
        total_price,
        created_at,
        products:product_id (
          id,
          title,
          primary_image_url,
          short_code
        )
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (itemsError) throw new Error(`Database error fetching order items: ${itemsError.message}`);

    // order number for single order using index 1
    const orderNumber = generateOrderNumber(order.created_at, 1);

    const orderHistory: OrderHistory = {
      id: order.id,
      user_id: order.user_id,
      order_number: orderNumber,
      total_amount: order.total_amount,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shiprocket_order_id: (order as any).shiprocket_order_id || null,
      shiprocket_tracking_url: (order as any).shiprocket_tracking_url || null,
      shiprocket_awb_code: (order as any).shiprocket_awb_code || null,
      items: (orderItems || []).map(item => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        final_price: item.final_price,
        total_price: item.total_price,
        created_at: item.created_at,
        product: Array.isArray(item.products) ? item.products[0] : item.products
      })),
      shipping_address: Array.isArray(order.addresses) ? order.addresses[0] : order.addresses
    };

    return {
      success: true,
      data: orderHistory
    };

  } catch (error) {
    console.error('Error in getUserOrderById:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}
