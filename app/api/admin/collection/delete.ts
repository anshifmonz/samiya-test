import { NextRequest, NextResponse } from 'next/server';
import deleteCollection from 'lib/api/admin/collection/delete';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/collection/delete');
    const { success, error, status } = await deleteCollection(id, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
