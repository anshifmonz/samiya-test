import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-admin-id');
    const adminUsername = request.headers.get('x-admin-username');
    const isSuperuser = request.headers.get('x-admin-superuser');

    if (!adminId || !adminUsername || isSuperuser === null) {
      return NextResponse.json({ error: 'Not authenticated', admin: null }, { status: 401 });
    }

    const admin = {
      id: adminId,
      username: adminUsername,
      is_superuser: isSuperuser === 'true',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({ error: null, admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', admin: null }, { status: 500 });
  }
}
