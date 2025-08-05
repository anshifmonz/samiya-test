import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { updateCartItemQuantity } from 'lib/user/cart';

export async function PUT(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { cartItemId, quantity } = await request.json();

    const result = await updateCartItemQuantity(user.id, cartItemId, quantity);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({ message: 'Cart item quantity updated successfully' }, { status: result.status || 200 });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
