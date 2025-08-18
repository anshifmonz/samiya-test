import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { initiatePaymentSession } from 'lib/user/payment';
import { type PaymentInitiationRequest, type PaymentInitiationResponse } from 'types/payment';

export async function POST(request: NextRequest): Promise<NextResponse<PaymentInitiationResponse | { error: string }>> {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: PaymentInitiationRequest = await request.json();
  const { orderId } = body;
  if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

  const { body: respBody, status } = await initiatePaymentSession(user.id, orderId);
  return NextResponse.json(respBody, { status });
}
