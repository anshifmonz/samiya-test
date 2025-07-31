import { NextRequest, NextResponse } from 'next/server';
import createCategory from 'lib/admin/category/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/category/create');
    const category = await createCategory(body, adminUserId, requestInfo);
    if (!category) return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
