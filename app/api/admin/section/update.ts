import { NextRequest, NextResponse } from 'next/server';
import { type Section } from 'types/section';
import updateSection, { reorderSections } from 'lib/admin/section/update';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/update');
    const section = await updateSection(body as Section, adminUserId, requestInfo);
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error in PUT /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionIds } = body;

    if (!sectionIds || !Array.isArray(sectionIds))
      return NextResponse.json(
        { error: 'sectionIds array is required' },
        { status: 400 }
      );

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/reorder');
    await reorderSections(sectionIds, adminUserId, requestInfo);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    );
  }
}
