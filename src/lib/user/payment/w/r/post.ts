import { supabaseAdmin } from 'lib/supabase';
import { verifyCashfreeWebhook } from 'utils/payment/cashfree';
import retry from 'utils/retry';

export async function processRefundWebhook(
  signature: string | null,
  timestamp: string | null,
  rawBody: string
): Promise<number> {
  console.log(rawBody);
  if (!signature || !timestamp) return 400;

  const isValidSignature = verifyCashfreeWebhook(signature, rawBody, timestamp);
  if (!isValidSignature) return 401;

  // Parse webhook data
  let webhookData;
  try {
    webhookData = JSON.parse(rawBody);
  } catch (error) {
    return 400;
  }

  const { type, data } = webhookData;
  if (type !== 'REFUND_STATUS_WEBHOOK' && type !== 'AUTO_REFUND_STATUS_WEBHOOK') return 200;

  const refund = data.refund || data.auto_refund;
  if (!refund) return 400;
  if (refund.refund_status !== 'SUCCESS') return 200;

  const cf_refund_id = refund.cf_refund_id;
  const cf_payment_id = refund.cf_payment_id;
  const refund_amount = refund.refund_amount;
  const refund_type = refund.refund_type || null;
  const refund_note = refund.refund_note || refund.refund_reason || null;

  const { data: paymentData, error: updateError } = await retry(async () => {
    return await supabaseAdmin
      .from('payments')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('cf_payment_id', cf_payment_id)
      .select('id, order_id')
      .single();
  });

  if (updateError) return 500;
  if (!paymentData || !paymentData.id) return 404;

  const { error: _ } = await retry(async () => {
    return await supabaseAdmin
    .from('refunds')
    .insert({
      payment_id: paymentData.id,
      cf_refund_id,
      gateway_response: refund,
      amount: refund_amount,
      type: refund_type,
      note: refund_note
    });
  });

  if (paymentData && paymentData?.order_id) {
    retry(async () => {
      return supabaseAdmin
        .from('orders')
        .update({
          status: 'returned',
          payment_status: 'refunded',
          updated_at: new Date().toISOString()
        })
      .eq('id', paymentData.order_id);
    });
  }

  return 200;
}
