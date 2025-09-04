import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { createRefund } from 'lib/api/user/payment/refund';
import { err, jsonResponse, ApiResponse } from 'utils/api/response';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const body = await request.json();
    const { orderId, amount, reason } = body;
    if (!orderId || typeof orderId !== 'string')
      return jsonResponse(err('Order ID is required and must be a string', 400));
    if (!amount || typeof amount !== 'number' || amount <= 0)
      return jsonResponse(err('Amount is required and must be a positive number', 400));
    if (reason && typeof reason !== 'string')
      return jsonResponse(err('Reason is required and must be a string', 400));

    const result = await createRefund(orderId, amount, reason);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
