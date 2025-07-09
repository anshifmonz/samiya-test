import { NextRequest, NextResponse } from 'next/server';
import getProducts from '@/lib/admin/product/get';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const limitNumber = limit ? parseInt(limit) : 16;
    const offsetNumber = offset ? parseInt(offset) : 0;
    const products = await getProducts(limitNumber, offsetNumber);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
