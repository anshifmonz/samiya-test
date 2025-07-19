import { NextRequest, NextResponse } from 'next/server';
import similarProducts from 'lib/public/similarProducts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (!id)
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    const limitCount = limit ? Math.min(Number(limit), 20) : 8;
    const offsetCount = offset ? Math.max(Number(offset), 0) : 0;

    const products = await similarProducts(id, limitCount, offsetCount);

    if (!products)
      return NextResponse.json({ error: 'Failed to fetch similar products' }, { status: 500 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in similar products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
