import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { addToCart } from 'lib/user/cart';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { productId, colorId, sizeId, quantity } = await request.json();

    const result = await addToCart(user.id, productId, colorId, sizeId, quantity);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({ message: 'Item added to cart successfully' }, { status: result.status || 200 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
