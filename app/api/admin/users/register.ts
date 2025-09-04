import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from 'lib/api/admin/users/registerUser';
import { AdminUser } from 'types/admin';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ error: string | null; admin: AdminUser | null }>> {
  try {
    const { username, password } = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/users/register');
    const {
      user: admin,
      error,
      status
    } = await registerUser(username, password, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error, admin }, { status: status || 500 });
    return NextResponse.json({ error: null, admin: admin as AdminUser }, { status: status || 201 });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal server error', admin: null }, { status: 500 });
  }
}
