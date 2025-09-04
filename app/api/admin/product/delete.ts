import { NextRequest, NextResponse } from 'next/server';
import deleteProduct from 'lib/api/admin/product/delete';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/product/delete');
    const { success, error, status } = await deleteProduct(id, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
