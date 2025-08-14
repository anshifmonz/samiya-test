import { supabaseAdmin } from "lib/supabase";
import {
  verifyCashfreeWebhook,
  mapCashfreeStatus,
} from "utils/payment/cashfree";
import { type CashfreeWebhookData } from "types/payment";
import { SRCreateOrder } from "lib/shiprocket";

export async function processWebhook(
  signature: string | null,
  timestamp: string | null,
  rawBody: string
): Promise<{ body: any; status: number }> {
  if (!signature || !timestamp)
    return { body: { error: "Invalid webhook headers" }, status: 400 };

  const isValidSignature = verifyCashfreeWebhook(signature, rawBody, timestamp);
  if (!isValidSignature)
    return { body: { error: "Invalid signature" }, status: 401 };

  // Parse webhook data
  let webhookData: CashfreeWebhookData;
  try {
    webhookData = JSON.parse(rawBody) as CashfreeWebhookData;
  } catch (error) {
    console.error("Invalid webhook JSON:", error);
    return { body: { error: "Invalid JSON" }, status: 400 };
  }

  const { type, data } = webhookData;
  if (type !== "PAYMENT_SUCCESS_WEBHOOK" && type !== "PAYMENT_FAILED_WEBHOOK")
    return { body: { message: "Webhook received" }, status: 200 };

  // Extract data
  let cfOrderId: string | undefined;
  let cf_payment_id: string | undefined;
  let payment_status: string | undefined;
  let payment_method: any;

  if (data.payment) {
    cfOrderId = data.payment.order_id;
    cf_payment_id = data.payment.cf_payment_id;
    payment_status = data.payment.payment_status;
    payment_method = data.payment.payment_method;
  } else if (data.order) {
    cfOrderId = data.order.order_id;
    payment_status = data.order.order_status;
  }

  if (!cfOrderId) return { body: { error: "Missing order_id" }, status: 400 };

  // Normalize status and delegate to transactional webhook RPC
  const normalizedStatus = mapCashfreeStatus(payment_status);
  const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
    "complete_order_from_webhook_rpc",
    {
      p_cf_order_id: cfOrderId,
      p_status: normalizedStatus,
      p_webhook: webhookData as any,
      p_cf_payment_id: cf_payment_id || null,
      p_payment_method: payment_method || null,
    }
  );

  if (rpcError) {
    console.error("complete_order_from_webhook_rpc error:", rpcError);
    return {
      body: { success: false, error: "Failed to process webhook" },
      status: 500,
    };
  }

  if (!(rpcData as any)?.success) {
    const rpcErrMsg = (rpcData as any)?.error || "Completion failed";
    return {
      body: { success: false, error: rpcErrMsg, status: normalizedStatus },
      status: 409,
    };
  }

  // Implement shiprocket
  SRCreateOrder(rpcData.order_id);
  // const shiprocketToken = await getShiprocketToken(); // login API
  // const srOrder = await createShiprocketOrder(shiprocketToken, localOrderData);
  // await saveOrderTrackingInfo(localOrderId, srOrder.order_id, srOrder.shipment_id, awbData.awb_code);

  return {
    body: {
      success: true,
      message: "Webhook processed",
      cf_order_id: cfOrderId,
      status: normalizedStatus,
    },
    status: 200,
  };
}
