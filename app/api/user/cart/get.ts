import { NextResponse } from 'next/server';
import { getUserCart } from 'lib/user/cart';
import { getServerUser } from 'utils/getServerSession';

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const result = await getUserCart(user.id);
    if (result.error) return NextResponse.json(result.data, { status: result.status || 200 });

    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
