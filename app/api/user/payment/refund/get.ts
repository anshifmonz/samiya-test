import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { getRefundById, getRefundsForOrder } from 'src/lib/user/payment/refund';

// GET /api/user/payment/refund?id=REFUND_ID - Get Refund by ID
// GET /api/user/payment/refund?orderId=ORDER_ID - Get All Refunds for an Order
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const refundId = searchParams.get('id');
    const orderId = searchParams.get('orderId');

    if (refundId) {
      const result = await getRefundById(orderId, refundId);
      if (!result) return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
      return NextResponse.json({ refund: result }, { status: 200 });
    } else if (orderId) {
      const result = await getRefundsForOrder(orderId);
      return NextResponse.json({ refunds: result }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Missing query parameter: id or orderId' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching refund(s):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
