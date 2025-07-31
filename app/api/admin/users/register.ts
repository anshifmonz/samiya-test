import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from 'lib/admin/users/registerUser';
import { AdminUser } from 'types/admin';
import { getAdminContext } from 'utils/adminApiHelpers';

export async function POST(request: NextRequest): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const { username, password } = await request.json();
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/users/register');
    const data = await registerUser(username, password, adminUserId, requestInfo);
    return NextResponse.json({ error: null, admins: [data] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
