import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { getPaymentStatus } from 'lib/api/user/payment';
import { err, jsonResponse, ApiResponse } from 'utils/api/response';
import { type PaymentStatusResponse } from 'types/payment';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaymentStatusResponse>>> {
  const user = await getServerUser();
  if (!user) return jsonResponse(err('Unauthorized', 401));

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const cfOrderId = searchParams.get('cfOrderId');

  const result = await getPaymentStatus(orderId, cfOrderId);
  return jsonResponse(result);
}
