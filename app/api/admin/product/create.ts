import { NextRequest, NextResponse } from 'next/server';
import createProduct from 'lib/api/admin/product/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/product/create');
    const { product, error, status } = await createProduct(body, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ product }, { status: status || 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
