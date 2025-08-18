import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { createRefund } from 'lib/user/payment/refund';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { orderId, amount, reason } = body;
    if (!orderId || typeof orderId !== 'string')
      return NextResponse.json({ error: 'Order ID is required and must be a string' }, { status: 400 });
    if (!amount || typeof amount !== 'number' || amount <= 0)
      return NextResponse.json({ error: 'Amount is required and must be a positive number' }, { status: 400 });
    if (reason && typeof reason !== 'string')
      return NextResponse.json({ error: 'Reason is required and must be a string' }, { status: 400 });

    const result = await createRefund(orderId, amount, reason);
    return NextResponse.json(
      { data: result, message: 'Refund created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
