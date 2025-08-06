import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { updateCartItemSelection } from 'lib/user/cart';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { cartItemId, isSelected } = await request.json();

    const result = await updateCartItemSelection(user.id, cartItemId, isSelected);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({ message: 'Cart item selection updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item selection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
