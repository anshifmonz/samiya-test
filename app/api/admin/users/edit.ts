import { NextRequest, NextResponse } from 'next/server';
import { editUser } from 'lib/admin/users/editUser';
import { AdminUser } from 'types/admin';

export async function PATCH(request: NextRequest): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const adminId = request.headers.get('x-admin-id')!;
    const isSuperuser = request.headers.get('x-admin-superuser') === 'true';
    const body = await request.json();
    const data = await editUser({
      ...body,
      adminId,
      isSuperuser,
    });
    return NextResponse.json({ error: null, admins: [data] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
