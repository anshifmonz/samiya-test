import { NextRequest, NextResponse } from 'next/server';
import createProduct from 'lib/admin/product/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/product/create');
    const product = await createProduct(body, adminUserId, requestInfo);
    if (!product) return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
