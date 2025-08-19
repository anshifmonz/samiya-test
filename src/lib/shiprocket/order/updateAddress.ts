import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export interface SRAddressUpdatePayload {
  order_id: string | number; // Shiprocket order id
  shipping_customer_name: string;
  shipping_phone: number;
  shipping_email?: string;
  shipping_address: string;
  shipping_address_2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_pincode: number;
}

export async function SRUpdateCustomerAddress(
  token: string,
  payload: SRAddressUpdatePayload
): Promise<ApiResponse<any>> {
  const { data, error, response } = await apiRequest(`${SR_BASE}/orders/address/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: payload,
    retry: true
  });

  if (error || (response && !response.ok)) return err('Failed to update address');
  return ok(data);
}
