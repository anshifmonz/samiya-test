import { supabaseAdmin } from 'lib/supabase';
import { err, ok, jsonResponse } from 'utils/api/response';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  if (!orderId) return jsonResponse(err('Order ID is required', 400));

  try {
    const { data, error } = await supabaseAdmin.rpc('get_order_details', { p_order_id: orderId });
    if (error) return jsonResponse(err('Failed to fetch order details'));
    if (!data) return jsonResponse(err('Order not found', 404));

    return jsonResponse(ok(data));
  } catch (_) {
    return jsonResponse(err('An unexpected error occurred'));
  }
}
