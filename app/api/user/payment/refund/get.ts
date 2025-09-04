import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'src/lib/utils/getServerSession';
import { getRefundById, getRefundsForOrder } from 'src/lib/api/user/payment/refund';
import { err, jsonResponse, ApiResponse } from 'src/lib/utils/api/response';

// GET /api/user/payment/refund?id=REFUND_ID - Get Refund by ID
// GET /api/user/payment/refund?orderId=ORDER_ID - Get All Refunds for an Order
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const { searchParams } = new URL(request.url);
    const refundId = searchParams.get('id');
    const orderId = searchParams.get('orderId');

    if (refundId) {
      const result = await getRefundById(orderId, refundId);
      if (!result) return jsonResponse(err('Refund not found', 404));
      return jsonResponse(result);
    } else if (orderId) {
      const result = await getRefundsForOrder(orderId);
      return jsonResponse(result);
    } else {
      return jsonResponse(err('Missing query parameter: id or orderId', 400));
    }
  } catch (_) {
    return jsonResponse(err());
  }
}
