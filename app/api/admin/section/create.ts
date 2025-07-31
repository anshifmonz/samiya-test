import { NextRequest, NextResponse } from 'next/server';
import createSection from 'lib/admin/section/create';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/create');
    const section = await createSection(body, adminUserId, requestInfo);
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error in POST /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
