import { NextRequest, NextResponse } from 'next/server';
import getProduct from 'lib/public/product';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const product = await getProduct(params.id);
    if (!product)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
