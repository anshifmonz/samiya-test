import { NextRequest, NextResponse } from 'next/server';
import createCollection from 'lib/admin/collection/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/collection/create');
    const collection = await createCollection(body, adminUserId, requestInfo);
    if (!collection) return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
