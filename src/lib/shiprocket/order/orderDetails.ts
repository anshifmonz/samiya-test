import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function SRGetOrderDetails(
  token: string,
  srOrderId: string | number
): Promise<ApiResponse<any>> {
  const { data, error, response } = await apiRequest(`${SR_BASE}/orders/show/${srOrderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (error || (response && !response.ok)) return err('Failed to fetch order details');
  return ok(data);
}
