import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { getPaymentStatus } from 'lib/user/payment';
import { type PaymentStatusResponse } from 'types/payment';

export async function GET(request: NextRequest): Promise<NextResponse<PaymentStatusResponse | { error: string }>> {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const cfOrderId = searchParams.get('cfOrderId');

  const { body, status } = await getPaymentStatus(user.id, orderId, cfOrderId);
  return NextResponse.json(body, { status });
}
