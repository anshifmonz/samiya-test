import { jsonResponse } from 'utils/api/response';
import { SRGetAllPickupLocations } from 'lib/shiprocket/pickupLocations';

export async function GET() {
  const result = await SRGetAllPickupLocations();
  return jsonResponse(result);
}
