import { NextRequest } from 'next/server';
import { err, jsonResponse } from 'utils/api/response';
import { SRAddPickupLocation } from 'lib/shiprocket/pickupLocations';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    if (!payload) return jsonResponse(err('Missing payload', 400));

    const result = await SRAddPickupLocation(payload);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to add pickup location'));
  }
}
