import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { deleteCartItem } from 'lib/user/cart';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { cartId } = await request.json();

    const result = await deleteCartItem(user.id, cartId);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({ message: 'Item deleted from cart successfully' }, { status: result.status || 200 });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
