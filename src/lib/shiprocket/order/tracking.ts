import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export async function SRTrackByShipmentId(
  token: string,
  shipmentId: string | number
): Promise<ApiResponse<any>> {
  if (!shipmentId) return err('Shipment ID is required', 400);
  if (typeof shipmentId !== 'string' && typeof shipmentId !== 'number')
    return err('Invalid shipment ID type', 400);

  const { data, error, response } = await apiRequest(
    `${SR_BASE}/courier/track/shipment/${shipmentId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (error || (response && !response.ok)) return err('Failed to track order');
  return ok(data);
}

export async function SRTrackByOrderId(
  token: string,
  srOrderId: string | number
): Promise<ApiResponse<any>> {
  if (!srOrderId) return err('Shiprocket order ID is required', 400);
  if (typeof srOrderId !== 'string' && typeof srOrderId !== 'number')
    return err('Invalid Shiprocket order ID type', 400);

  const { data, error, response } = await apiRequest(`${SR_BASE}/courier/track/awb/${srOrderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (error || (response && !response.ok)) return err('Failed to track order');
  return ok(data);
}
