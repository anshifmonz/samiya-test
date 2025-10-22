import { supabaseAdmin } from 'lib/supabase';
import { err, ok, jsonResponse } from 'utils/api/response';
import { createCashfreeRefund } from 'utils/payment/cashfree.refund';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const { reason } = await request.json();

  if (!orderId) return jsonResponse(err('Order ID is required', 400));
  if (!reason) return jsonResponse(err('Reason is required', 400));

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('final_price')
    .eq('id', orderId)
    .single();

  if (orderError) return jsonResponse(err());
  if (!order) return jsonResponse(err('Order not found', 404));

  const { data, error } = await createCashfreeRefund(
    orderId,
    order.final_price,
    reason
  );

  if (error) return jsonResponse(err('Failed to initiate refund'));
  return jsonResponse(ok({ message: 'Refund processing initiated' }));
}
