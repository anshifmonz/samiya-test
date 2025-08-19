import { NextRequest } from 'next/server';
import { err, jsonResponse } from 'utils/api/response';
import { updateDeliveryAddress } from 'lib/shiprocket/orders';

export async function POST(request: NextRequest) {
  try {
    const { localOrderId, update } = await request.json();
    if (!localOrderId || !update) return jsonResponse(err('Missing required fields', 400));

    const result = await updateDeliveryAddress(localOrderId, update);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to update address'));
  }
}
