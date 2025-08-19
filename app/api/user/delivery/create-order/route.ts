import { NextRequest } from 'next/server';
import { SRCreateOrder } from 'lib/shiprocket';
import { err, jsonResponse } from 'utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    if (!orderId) return jsonResponse(err('Missing required field: orderId', 400));

    const result = await SRCreateOrder(orderId);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to create order'));
  }
}
