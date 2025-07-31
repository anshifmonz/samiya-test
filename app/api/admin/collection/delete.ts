import { NextRequest, NextResponse } from 'next/server';
import deleteCollection from 'lib/admin/collection/delete';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/collection/delete');
    const success = await deleteCollection(id, adminUserId, requestInfo);
    if (!success) return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
