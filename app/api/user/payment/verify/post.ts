import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { verifyPayment } from 'lib/user/payment';
import { type PaymentVerificationRequest, type PaymentVerificationResponse } from 'types/payment';

export async function POST(request: NextRequest): Promise<NextResponse<PaymentVerificationResponse | { error: string }>> {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: PaymentVerificationRequest = await request.json();
  const { body: respBody, status } = await verifyPayment(user.id, body);
  return NextResponse.json(respBody, { status });
}

