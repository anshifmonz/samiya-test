import { NextRequest, NextResponse } from 'next/server';
import { deleteUser } from 'lib/admin/users/deleteUser';
import { AdminUser } from 'types/admin';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function DELETE(request: NextRequest): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/users/delete');
    await deleteUser(id!, adminUserId, requestInfo);
    return NextResponse.json({ error: null, admins: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
