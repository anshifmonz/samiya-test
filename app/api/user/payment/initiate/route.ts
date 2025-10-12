import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'src/lib/utils/getServerSession';
import { initiatePaymentSession } from 'src/lib/api/user/payment';
import { type PaymentInitiationRequest, type PaymentInitiationResponse } from 'src/types/payment';

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaymentInitiationResponse | { error: string }>> {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const phone = user.user_metadata.phone_number;
  const body: PaymentInitiationRequest = await request.json();
  const { orderId } = body;
  if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

  const { data, status } = await initiatePaymentSession(user.id, phone, orderId);
  return NextResponse.json(data, { status });
}
