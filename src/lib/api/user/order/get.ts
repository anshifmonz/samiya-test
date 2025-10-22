import { createClient } from 'lib/supabase/server';
import { GetOrderHistoryResponse, OrderHistory } from 'types/order';
import { generateOrderNumber } from 'utils/orderUtils';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function getUserOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<GetOrderHistoryResponse>> {
  try {
    if (!userId || typeof userId !== 'string')
      return err('User ID is required and must be a string', 400);
    if (page < 1) return err('Page must be greater than 0', 400);
    if (limit < 1 || limit > 25) return err('Limit must be between 1 and 25', 400);

    const supabase = createClient();

    const { data, error } = await supabase.rpc('get_orders', {
      p_user_id: userId,
      p_page: page,
      p_limit: limit
    });

    if (error) return err('Failed to fetch orders. Please try again later.');

    const { orders, totalCount } = data;
    if (!orders || orders.length === 0) {
      return ok({
        orders: [],
        totalCount: totalCount || 0,
        page,
        limit
      });
    }

    const orderHistory: OrderHistory[] = orders.map((order: any) => {
      return {
        ...order,
        order_number: `#${order.id.substring(0, 6).toLocaleUpperCase()}`,
        items: order.items || [],
        shipping_address: order.shipping_address
      };
    });

    return ok({
      orders: orderHistory,
      totalCount: totalCount || 0,
      page,
      limit
    });
  } catch (_) {
    return err('An unexpected error occurred. Please try again later.');
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

    const supabase = createClient();

    const { data: order, error } = await supabase.rpc('get_a_order', {
      p_user_id: userId,
      p_order_id: orderId
    });

    if (error) return err('Failed to fetch order details. Please try again later.');
    if (!order) return err('Order not found', 404);

    const orderHistory: OrderHistory = {
      ...(order as any),
      order_number: `#${order.id.substring(0, 6).toLocaleUpperCase()}`,
      items: (order as any).items || [],
      shipping_address: (order as any).shipping_address
    };

    return ok(orderHistory);
  } catch (_) {
    return err('An unexpected error occurred. Please try again later.');
  }
}
