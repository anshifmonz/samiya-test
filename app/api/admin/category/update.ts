import { NextRequest, NextResponse } from 'next/server';
import updateCategory from 'lib/admin/category/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/category/update');
    const { category, error, status } = await updateCategory(body, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ category }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
