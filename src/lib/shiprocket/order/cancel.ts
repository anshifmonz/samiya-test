import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function SRCancelOrder(token: string, srOrderId: number): Promise<ApiResponse<any>> {
  const { data, error, response } = await apiRequest(`${SR_BASE}/orders/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: { ids: [srOrderId] },
    retry: true
  });

  if (error || (response && !response.ok)) return err('Failed to cancel order');
  return ok(data);
}
