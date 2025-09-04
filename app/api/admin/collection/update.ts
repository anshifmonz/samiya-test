import { NextRequest, NextResponse } from 'next/server';
import updateCollection from 'lib/api/admin/collection/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/collection/update');
    const { collection, error, status } = await updateCollection(body, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ collection }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
