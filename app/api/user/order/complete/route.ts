import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { completeOrder } from 'lib/user/order/complete';
import { err, jsonResponse } from 'utils/api/response';

export const dynamic = 'force-dynamic';

interface CompleteOrderRequestBody {
  checkoutId: string;
  orderId: string;
  paymentId: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const body: CompleteOrderRequestBody = await request.json();
    const { checkoutId, orderId, paymentId } = body || ({} as any);

    const result = await completeOrder(user.id, checkoutId, orderId, paymentId);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
