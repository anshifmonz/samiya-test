import { NextRequest, NextResponse } from 'next/server';
import { editUser } from 'lib/admin/users/editUser';
import { AdminUser } from 'types/admin';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function PATCH(request: NextRequest) :Promise<NextResponse<{ error: string | null; admin: AdminUser | null }>> {
  try {
    const adminId = request.headers.get('x-admin-id')!;
    const isSuperuser = request.headers.get('x-admin-superuser') === 'true';
    const body = await request.json();
    const { requestInfo } = getAdminContext(request, '/api/admin/users/edit');
    const { user, error, status } = await editUser({
      ...body,
      adminId,
      isSuperuser,
      requestInfo,
    });
    if (error) return NextResponse.json({ error, admin: user }, { status: status || 500 });
    return NextResponse.json({ error, admin: user as AdminUser }, { status: status || 200 });
  } catch (error: any) {
    console.error('Error editing user:', error);
    return NextResponse.json({ error: 'Internal server error', admin: null }, { status: 500 });
  }
}
