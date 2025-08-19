import { NextRequest } from 'next/server';
import { err, jsonResponse } from 'utils/api/response';
import { getTrackingByOrderId } from 'lib/shiprocket/orders';

export async function POST(request: NextRequest) {
  try {
    const { localOrderId } = await request.json();
    if (!localOrderId) return jsonResponse(err('Missing required field: localOrderId', 400));

    const result = await getTrackingByOrderId(localOrderId);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to track order'));
  }
}
