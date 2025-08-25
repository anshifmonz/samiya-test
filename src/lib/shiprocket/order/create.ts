import { getShiprocketToken } from '../shiprocket';
import { apiRequest } from 'utils/apiRequest';
import { err, ok } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function createOrder(payload: any): Promise<any | false> {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data, error, response } = await apiRequest(`${SR_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: payload,
    retry: true
  });
  if (error || (response && !response.ok)) return err('Failed to create order');
  return ok(data);
}
