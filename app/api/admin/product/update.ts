import { NextRequest, NextResponse } from 'next/server';
import updateProduct from 'lib/admin/product/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/product/update');
    const {product, error, status } = await updateProduct(body, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    const statusCode = error.message?.includes('required') || error.message?.includes('must be') ? 400 : 500;
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: statusCode });
  }
}
