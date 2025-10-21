import { NextRequest } from 'next/server';
import { SRCreateOrder } from 'lib/shiprocket/createOrder';
import { err, ok, jsonResponse } from 'utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { localOrderId } = body;
    if (!localOrderId) return jsonResponse(err('Missing required field: localOrderId', 400));

    const result = await SRCreateOrder(localOrderId);
    if (!result.success) return jsonResponse(err(result.error));

    return jsonResponse(ok(result.data));
  } catch (_) {
    return jsonResponse(err('Failed to approve order'));
  }
}
