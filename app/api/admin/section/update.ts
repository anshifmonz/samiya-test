import { NextRequest, NextResponse } from 'next/server';
import { type Section } from 'types/section';
import updateSection, { reorderSections } from 'lib/api/admin/section/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/update');
    const { section, error, status } = await updateSection(
      body as Section,
      adminUserId,
      requestInfo
    );
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ section });
  } catch (error: any) {
    console.error('Error updating section:', error);
    const statusCode =
      error.message?.includes('required') ||
      error.message?.includes('must be') ||
      error.message?.includes('cannot be empty')
        ? 400
        : 500;
    return NextResponse.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: statusCode }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionIds } = body;

    if (!sectionIds || !Array.isArray(sectionIds))
      return NextResponse.json({ error: 'sectionIds array is required' }, { status: 400 });

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/reorder');
    const { success, error, status } = await reorderSections(sectionIds, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error reordering sections:', error);
    const statusCode =
      error.message?.includes('required') || error.message?.includes('must be') ? 400 : 500;
    return NextResponse.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: statusCode }
    );
  }
}
