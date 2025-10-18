import { NextRequest, NextResponse } from 'next/server';
import getProducts from 'lib/api/admin/product/get';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const query = searchParams.get('q');
    const sortBy = searchParams.get('sort_by');
    const stock_filter = searchParams.get('stock_filter');
    const limitNumber = limit ? parseInt(limit) : 16;
    const offsetNumber = offset ? parseInt(offset) : 0;
    const queryText = query || '';
    const sortByValue = sortBy || 'updated_at';
    const { products, error, status } = await getProducts(
      limitNumber,
      offsetNumber,
      queryText,
      sortByValue,
      stock_filter
    );
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
