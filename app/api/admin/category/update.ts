import { NextRequest, NextResponse } from 'next/server';
import updateCategory from 'lib/admin/category/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/category/update');
    const category = await updateCategory(body, adminUserId, requestInfo);
    if (!category) return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
