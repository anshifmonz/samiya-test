import { apiRequest } from 'utils/apiRequest';
import { ApiResponse, ok, err } from 'utils/api/response';
import { getShiprocketToken } from './shiprocket';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export interface SRPickupLocation {
  pickup_location: string; // nickname of pickup location (max 36 chars)
  name: string; // shipper's name
  email: string; // shipper's email
  phone: number; // shipper's phone number
  address: string; // primary address (max 80 chars)
  address_2?: string; // additional address details
  city: string; // city name
  state: string; // state name
  country: string; // country name
  pin_code: number; // pincode
  lat?: number; // latitude
  long?: number; // longitude
  address_type?: string; // e.g., "vendor"
  vendor_name?: string; // vendor name if address_type is vendor
  gstin?: string; // GSTIN of vendor
}

/**
 * Fetch all pickup locations for the authenticated account
 */
export async function SRGetAllPickupLocations(): Promise<ApiResponse<SRPickupLocation[]>> {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data, error, response } = await apiRequest(`${SR_BASE}/settings/company/pickup`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (error || (response && !response.ok)) return err('Failed to fetch pickup locations');
  return ok(data as SRPickupLocation[]);
}

/**
 * Add a new pickup location
 */
export async function SRAddPickupLocation(payload: SRPickupLocation): Promise<ApiResponse<any>> {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data, error, response } = await apiRequest(`${SR_BASE}/settings/company/addpickup`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: payload,
    retry: true
  });

  if (error || (response && !response.ok)) return err('Failed to add pickup location');
  return ok(data);
}
