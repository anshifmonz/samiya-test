import { NextRequest, NextResponse } from 'next/server';
import createCategory from 'lib/admin/category/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/category/create');
    const { category, error, status } = await createCategory(body, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ category }, { status: status || 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
