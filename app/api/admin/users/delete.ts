import { NextRequest, NextResponse } from 'next/server';
import { deleteUser } from 'lib/api/admin/users/deleteUser';
import { AdminUser } from 'types/admin';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/users/delete');
    const { success, error, status } = await deleteUser(id!, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error, admins: [] }, { status: status || 500 });
    return NextResponse.json({ error: null, admins: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
