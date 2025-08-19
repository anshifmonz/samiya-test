import { type SRReturnOrderPayload } from '../types';
import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';
import { getShiprocketToken } from '../shiprocket';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function SRCreateReturn(payload: SRReturnOrderPayload): Promise<ApiResponse<any>> {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data, error, response } = await apiRequest(`${SR_BASE}/orders/create/return`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: payload,
    retry: true
  });

  if (error || (response && !response.ok)) return err('Failed to create return');
  return ok(data);
}
