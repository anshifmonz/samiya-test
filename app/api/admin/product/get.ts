import { NextRequest, NextResponse } from 'next/server';
import getProducts from 'lib/admin/product/get';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const query = searchParams.get('q');
    const sortBy = searchParams.get('sort_by');
    const limitNumber = limit ? parseInt(limit) : 16;
    const offsetNumber = offset ? parseInt(offset) : 0;
    const queryText = query ? query : null;
    const products = await getProducts(limitNumber, offsetNumber, queryText, sortBy);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
