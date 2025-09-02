import { NextRequest } from 'next/server';
import { err, jsonResponse } from 'utils/api/response';
import { getTrackingByOrderId } from 'lib/shiprocket/orders';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    if (!orderId) return jsonResponse(err('Missing required field: orderId', 400));

    const result = await getTrackingByOrderId(orderId);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to track order'));
  }
}
