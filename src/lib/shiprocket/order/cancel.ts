import { apiRequest } from 'utils/apiRequest';
import { supabaseAdmin } from 'lib/supabase';
import { ok, err, type ApiResponse } from 'utils/api/response';
import retry from 'utils/retry';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function SRCancelOrder(
  token: string,
  srOrderId: number,
  localOrderId: string
): Promise<ApiResponse<any>> {
  if (srOrderId) {
    const { error, response } = await apiRequest(`${SR_BASE}/orders/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: { ids: [srOrderId] },
      retry: true
    });
    if (error || (response && !response.ok)) return err('Failed to cancel order');
  }

  const { error: orderError } = await retry(async () => {
    return await supabaseAdmin
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', localOrderId)
      .single();
  });
  if (!orderError) return ok(null); // success

  retry(async () => {
    return supabaseAdmin
      .from('cancel_order')
      .insert({ order_id: localOrderId });
  }, 5);
  return err();
}
