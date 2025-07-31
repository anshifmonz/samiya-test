import { NextRequest, NextResponse } from 'next/server';
import deleteProduct from 'lib/admin/product/delete';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/product/delete');
    const success = await deleteProduct(id, adminUserId, requestInfo);
    if (!success) return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
