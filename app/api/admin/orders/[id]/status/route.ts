import { supabaseAdmin } from 'lib/supabase';
import { err, ok, jsonResponse } from 'utils/api/response';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const { status } = await request.json();

  if (!orderId) return jsonResponse(err('Order ID is required', 400));
  if (!status) return jsonResponse(err('Status is required', 400));

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) return jsonResponse(err('Failed to update order status'));
    if (!data) return jsonResponse(err('Order not found', 404));

    return jsonResponse(ok(data));
  } catch (_) {
    return jsonResponse(err('An unexpected error occurred'));
  }
}
