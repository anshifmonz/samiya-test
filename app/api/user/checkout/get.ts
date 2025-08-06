import { NextResponse } from 'next/server';
import { getCheckout } from 'lib/user/checkout';
import { getServerUser } from 'utils/getServerSession';

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const result = await getCheckout(user.id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json(result.data, { status: result.status || 200 });
  } catch (error) {
    console.error('Error fetching checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
