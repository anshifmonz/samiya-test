import { NextRequest } from 'next/server';
import { err, jsonResponse } from 'utils/api/response';
import { createReturnForOrder } from 'lib/shiprocket/orders';

export async function POST(request: NextRequest) {
  try {
    const { localOrderId, payload } = await request.json();
    if (!localOrderId || !payload) return jsonResponse(err('Missing required fields', 400));

    const result = await createReturnForOrder(localOrderId, payload);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to create return'));
  }
}
