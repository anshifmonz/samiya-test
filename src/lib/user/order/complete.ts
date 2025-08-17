import { supabaseAdmin } from 'lib/supabase';
import { fetchCashfreeOrder, mapCashfreeStatus } from 'utils/payment/cashfree';

export async function completeOrder(
  userId: string,
  checkoutId: string,
  orderId: string,
  paymentId: string
): Promise<{ error: string | null; status: number }> {
  try {
    if (!checkoutId) return { error: 'checkoutId is required', status: 400 };
    if (!userId) return { error: 'userId is required', status: 400 };
    if (!orderId) return { error: 'orderId is required', status: 400 };
    if (!paymentId) return { error: 'paymentId is required', status: 400 };

    // Validate that the order belongs to the user and is in a payable state
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, user_id, status, payment_status')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderErr || !order) return { error: 'Order not found', status: 404 };

    // Validate checkout belongs to user
    const { data: checkout, error: checkoutErr } = await supabaseAdmin
      .from('checkout')
      .select('id, user_id, status')
      .eq('id', checkoutId)
      .eq('user_id', userId)
      .single();

    if (checkoutErr || !checkout) return { error: 'Checkout session not found', status: 404 };

    // Fetch payment and ensure it belongs to order
    const { data: payment, error: paymentErr } = await supabaseAdmin
      .from('payments')
      .select('id, order_id, status, cf_order_id, payment_amount, method')
      .eq('id', paymentId)
      .eq('order_id', orderId)
      .single();

    if (paymentErr || !payment) return { error: 'Payment record not found', status: 404 };

    // If payment isn't already completed, verify with gateway and update
    if (payment.status !== 'completed') {
      if (!payment.order_id) return { error: 'Payment not linked to gateway order', status: 400 };
      const cf = await fetchCashfreeOrder(payment.order_id);
      if (!cf.success) return { error: 'Failed to verify payment status', status: 400 };

      const newPaymentStatus = mapCashfreeStatus(cf.data?.order_status || '');
      if (newPaymentStatus !== 'completed') {
        const msg = newPaymentStatus === 'failed' ? 'Payment failed' : 'Payment not completed yet';
        const code = newPaymentStatus === 'failed' ? 402 : 202;
        return { error: msg, status: code };
      }

      const { error: updPayErr } = await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
          gateway_response: cf.data
        })
        .eq('id', payment.id);

      if (updPayErr) {
        console.error('Failed updating payment status:', updPayErr);
        return { error: 'Failed to finalize payment record', status: 500 };
      }
    }

    // Complete order via transactional RPC
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('complete_order_rpc', {
      p_user_id: userId,
      p_order_id: orderId,
      p_checkout_id: checkoutId,
      p_payment_id: paymentId
    });

    if (rpcError) {
      console.error('complete_order_rpc error:', rpcError);
      return { error: 'Failed to complete order', status: 500 };
    }

    if (!rpcData || (rpcData as any).success !== true)
      return { error: 'Failed to complete order', status: 500 };

    return { error: null, status: 200 };
  } catch (error) {
    console.error('Order completion error:', error);
    return { error: 'Internal server error', status: 500 };
  }
}
