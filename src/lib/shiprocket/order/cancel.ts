import { supabaseAdmin } from 'lib/supabase';
import retry from 'utils/retry';
import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';
import { createCashfreeRefund } from 'utils/payment/cashfree.refund';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

async function postCancellation(localOrderId: string) {
  const { data: orderData, error: orderError } = await retry(async () => {
    return supabaseAdmin
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', localOrderId)
      .select('final_price')
      .single();
  });

  if (orderError) {
    const { error } = await retry(async () => {
      return supabaseAdmin
        .from('order_status_update')
        .insert({
          order_id: localOrderId,
          status: 'cancelled'
        });
    }, 5);
    if (error) console.error('order_status_update: ' + localOrderId)
    return;
  }

  createCashfreeRefund(
    localOrderId,
    orderData.final_price,
    "Customer don't need this product anymore."
  );
}

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
  postCancellation(localOrderId);
  return ok(null);
}
