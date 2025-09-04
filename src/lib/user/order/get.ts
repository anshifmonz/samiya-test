import { supabaseAdmin } from 'lib/supabase';
import { GetOrderHistoryResponse, OrderHistory } from 'types/order';
import { generateOrderNumber, getOrderIndexForYear } from 'utils/orderUtils';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function getUserOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<GetOrderHistoryResponse>> {
  try {
    if (!userId || typeof userId !== 'string') return err('User ID is required and must be a string', 400);
    if (page < 1) return err('Page must be greater than 0', 400);
    if (limit < 1 || limit > 100) return err('Limit must be between 1 and 100', 400);

    const offset = (page - 1) * limit;

    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) return err();

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(
        `
        id,
        user_id,
        total_amount,
        status,
        payment_method,
        payment_status,
        created_at,
        updated_at,
        shiprocket_order_id,
        shiprocket_awb_code,
        order_address:order_address_id (
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
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (ordersError) return err();

    if (!orders || orders.length === 0) {
      return ok({
        orders: [],
        totalCount: totalCount || 0,
        page,
        limit
      });
    }

    const orderIds = orders.map(order => order.id);
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(
        `
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        final_price,
        total_price,
        created_at,
        products:product_id (id),
        product_colors:color_id (
          color_name,
          hex_code
        ),
        sizes:size_id (name)
      `
      )
      .in('order_id', orderIds)
      .order('created_at', { ascending: true });

    if (itemsError) return err();

    const { data: productImages, error: imagesError } = await supabaseAdmin
      .from('product_images')
      .select('product_id, color_name, hex_code, image_url')
      .eq('sort_order', 0)
      .in('product_id', orderItems.map(i => i.product_id));

    if (imagesError) return err();

    const imageMap = new Map<string, string>();
    productImages?.forEach(img => {
      const key = `${img.product_id}-${img.color_name}-${img.hex_code}`;
      imageMap.set(key, img.image_url);
    });

    // Group order items by order_id
    const itemsByOrderId = (orderItems || []).reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];

      // Find matching image for product + color
      const key = `${item.product_id}-${(item.product_colors as any)?.color_name}-${(item.product_colors as any)?.hex_code}`;
      const image_url = imageMap.get(key) || null;

      acc[item.order_id].push({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        final_price: item.final_price,
        total_price: item.total_price,
        created_at: item.created_at,
        product: Array.isArray(item.products) ? item.products[0] : item.products,
        color: (item.product_colors as any)?.color_name || null,
        size: (item.sizes as any)?.name || null,
        image_url: image_url || null
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
        shiprocket_awb_code: (order as any).shiprocket_awb_code || null,
        items: itemsByOrderId[order.id] || [],
        shipping_address: Array.isArray(order.order_address) ? order.order_address[0] : order.order_address
      };
    });

    return ok({
      orders: orderHistory,
      totalCount: totalCount || 0,
      page,
      limit
    });
  } catch (_) {
    return err();
  }
}

export async function getUserOrderById(
  userId: string,
  orderId: string
): Promise<ApiResponse<OrderHistory>> {
  try {
    if (!userId || typeof userId !== 'string')
      return err('User ID is required and must be a string', 400);
    if (!orderId || typeof orderId !== 'string')
      return err('Order ID is required and must be a string', 400);

    // Get specific order with shipping address
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(
        `
        id,
        user_id,
        total_amount,
        status,
        payment_method,
        payment_status,
        created_at,
        updated_at,
        shiprocket_order_id,
        shiprocket_awb_code,
        order_address:order_address_id (
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
      `
      )
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') return err('Order not found', 404);
      return err();
    }

    // Get order items with product details
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(
        `
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        final_price,
        total_price,
        created_at,
        products:product_id (id),
        product_colors:color_id (
          color_name,
          hex_code
        ),
        sizes:size_id (name)
      `
      )
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (itemsError) return err();

    const { data: productImages, error: imagesError } = await supabaseAdmin
      .from('product_images')
      .select('product_id, color_name, hex_code, image_url')
      .eq('is_primary', true)
      .in('product_id', orderItems.map(i => i.product_id));

    if (imagesError) return err();

    // order number for single order using index 1
    const orderNumber = generateOrderNumber(order.created_at, 1);

    const items = (orderItems || []).map(item => {
      // Find matching image for product + color
      const image = productImages?.find(img =>
        img.product_id === item.product_id &&
        img.color_name === (item.product_colors as any)?.color_name &&
        img.hex_code === (item.product_colors as any)?.hex_code
      );
      return {
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        final_price: item.final_price,
        total_price: item.total_price,
        created_at: item.created_at,
        color: (item.product_colors as any)?.color_name || null,
        size: (item.sizes as any)?.name || null,
        image_url: image?.image_url || null,
        product: Array.isArray(item.products) ? item.products[0] : item.products
      }
    })

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
      shiprocket_awb_code: (order as any).shiprocket_awb_code || null,
      items: items,
      shipping_address: Array.isArray(order.order_address) ? order.order_address[0] : order.order_address
    };

    return ok(orderHistory);
  } catch (_) {
    return err();
  }
}
