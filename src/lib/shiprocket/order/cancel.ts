import { supabaseAdmin } from 'lib/supabase';
import retry from 'utils/retry';
import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';
import { createCashfreeRefund } from 'utils/payment/cashfree.refund';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function SRCancelOrder(
  token: string,
  srOrderId: number,
  localOrderId: string
): Promise<ApiResponse<any>> {
  if (srOrderId) {
    const { error } = await apiRequest(`${SR_BASE}/orders/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: { ids: [srOrderId] },
      retry: true
    });
    if (error) return err('Failed to cancel order');
  }

  const { data: orderData, error: orderError } = await retry(async () => {
    return supabaseAdmin
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', localOrderId)
      .select('total_amount')
      .single();
  });

  if (orderError) {
    retry(async () => {
      return supabaseAdmin
        .from('pending_order_cancellation')
        .insert({ order_id: localOrderId });
    }, 5);
    return ok(null)
  }

  const { error: refundError } = await createCashfreeRefund(
    localOrderId,
    localOrderId,
    orderData.total_amount,
    "Customer don't need this product anymore."
  );

  if (refundError) {
    retry(async () => {
      return supabaseAdmin
        .from('pending_refunds')
        .insert({
          order_id: localOrderId,
          total_amout: orderData.total_amount
        });
    }, 5);
  }

  return ok(null);
}
