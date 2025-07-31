import { NextRequest, NextResponse } from 'next/server';
import deleteCategory from 'lib/admin/category/delete';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/category/delete');
    const success = await deleteCategory(id, adminUserId, requestInfo);
    if (!success) return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
