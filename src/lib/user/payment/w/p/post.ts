import { supabaseAdmin } from 'lib/supabase';
import { verifyCashfreeWebhook } from 'utils/payment/cashfree';
import { SRCreateOrder } from 'lib/shiprocket';

export async function processWebhook(
  signature: string | null,
  timestamp: string | null,
  rawBody: string
): Promise<number> {
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
  if (
    type !== 'PAYMENT_SUCCESS_WEBHOOK' &&
    type !== 'PAYMENT_FAILED_WEBHOOK' &&
    type !== 'PAYMENT_USER_DROPPED_WEBHOOK'
  )
    return 200;

  // Extract data
  const orderId: string | undefined = data.order.order_id;
  const cf_payment_id: string | undefined = data.payment.cf_payment_id;
  const payment_status: string | undefined = data.payment.payment_status;
  const payment_method = Object.keys(data.payment.payment_method)[0];

  if (!orderId) return 400;

  const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
    'complete_order_from_webhook_rpc',
    {
      p_order_id: orderId,
      p_status: payment_status,
      p_webhook: webhookData.data as any,
      p_cf_payment_id: cf_payment_id || null,
      p_payment_method: payment_method || null
    }
  );

  if (rpcError) return 500;
  if (!(rpcData as any)?.success) return 500;

  // const { success } = await SRCreateOrder(rpcData.order_id);
  // if (!success) return 500;

  return 200;
}
