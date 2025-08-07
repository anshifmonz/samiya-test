import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { getUserOrders, getUserOrderById } from 'lib/user/order';

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // If orderId provided, then return specific order
    if (orderId) {
      const result = await getUserOrderById(user.id, orderId);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

      return NextResponse.json({
        order: result.data
      }, { status: 200 });
    }

    // else, return paginated order history
    const result = await getUserOrders(user.id, page, limit);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
