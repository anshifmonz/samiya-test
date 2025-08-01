import { NextRequest, NextResponse } from 'next/server';
import createSection from 'lib/admin/section/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/create');
    const {section, error, status } = await createSection(body, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ section });
  } catch (error: any) {
    console.error('Error creating section:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
