import { err, ok, type ApiResponse } from 'utils/api/response';
import { supabaseAdmin } from 'lib/supabase';
import { fetchCashfreeOrder, mapCashfreeStatus } from 'utils/payment/cashfree';

export async function completeOrder(
  userId: string,
  checkoutId: string,
  orderId: string,
  paymentId: string
): Promise<ApiResponse<{ status: number }>> {
  if (!checkoutId) return err('checkoutId is required', 400);
  if (!userId) return err('userId is required', 400);
  if (!orderId) return err('orderId is required', 400);
  if (!paymentId) return err('paymentId is required', 400);

  // Validate that the order belongs to the user and is in a payable state
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select('id, user_id, status, payment_status')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (orderErr || !order) return err('Order not found', 404);

  // Validate checkout belongs to user
  const { data: checkout, error: checkoutErr } = await supabaseAdmin
    .from('checkout')
    .select('id, user_id, status')
    .eq('id', checkoutId)
    .eq('user_id', userId)
    .single();

  if (checkoutErr || !checkout) return err('Checkout session not found', 404);

  // Fetch payment and ensure it belongs to order
  const { data: payment, error: paymentErr } = await supabaseAdmin
    .from('payments')
    .select('id, order_id, status, cf_order_id, payment_amount, method')
    .eq('id', paymentId)
    .eq('order_id', orderId)
    .single();

  if (paymentErr || !payment) return err('Payment record not found', 404);

  // If payment isn't already completed, verify with gateway and update
  if (payment.status !== 'completed') {
    if (!payment.order_id) return err('Payment not linked to gateway order', 400);
    const cf = await fetchCashfreeOrder(payment.order_id);
    if (!cf.success) return err('Failed to verify payment status', 400);

    const newPaymentStatus = mapCashfreeStatus(cf.data?.order_status || '');
    if (newPaymentStatus !== 'completed') {
      const msg = newPaymentStatus === 'failed' ? 'Payment failed' : 'Payment not completed yet';
      const code = newPaymentStatus === 'failed' ? 402 : 202;
      return err(msg, code);
    }

    const { error: updPayErr } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
        gateway_response: cf.data
      })
      .eq('id', payment.id);

    if (updPayErr) return err('Failed to finalize payment record', 500);
  }

  // Complete order via transactional RPC
  const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('complete_order_rpc', {
    p_user_id: userId,
    p_order_id: orderId,
    p_checkout_id: checkoutId,
    p_payment_id: paymentId
  });

  if (rpcError) return err('Failed to complete order', 500);
  if (!rpcData || (rpcData as any).success !== true) return err('Failed to complete order', 500);
  return ok({ status: 200 });
}
