import { NextRequest, NextResponse } from 'next/server';
import deleteSection from 'lib/admin/section/delete';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id)
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/delete');
    const { success, error, status } = await deleteSection(id, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error deleting section:', error);
    const statusCode = error.message?.includes('required') || error.message?.includes('must be') ? 400 : 500;
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: statusCode });
  }
}
