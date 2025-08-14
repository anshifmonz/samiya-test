import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { completeOrder } from 'lib/user/order/complete';

export const dynamic = 'force-dynamic';

interface CompleteOrderRequestBody {
  checkoutId: string;
  orderId: string;
  paymentId: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body: CompleteOrderRequestBody = await request.json();
    const { checkoutId, orderId, paymentId } = body || {} as any;

    const { error, status } = await completeOrder(user.id, checkoutId, orderId, paymentId);
    if (error) return NextResponse.json({ error }, { status: status || 500 });

    return NextResponse.json({ status: status, message: 'Order completed successfully' }, { status: status || 200 });
  } catch (error) {
    console.error('Order completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

