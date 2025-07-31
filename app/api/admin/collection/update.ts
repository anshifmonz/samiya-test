import { NextRequest, NextResponse } from 'next/server';
import updateCollection from 'lib/admin/collection/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/collection/update');
    const collection = await updateCollection(body, adminUserId, requestInfo);
    if (!collection) return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
    return NextResponse.json({ collection });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
