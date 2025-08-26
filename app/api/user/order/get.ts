import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { err, jsonResponse } from 'utils/api/response';
import { getUserOrders, getUserOrderById } from 'lib/user/order';

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (orderId) {
      const result = await getUserOrderById(user.id, orderId);
      return jsonResponse(result);
    }

    const result = await getUserOrders(user.id, page, limit);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
