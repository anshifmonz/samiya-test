import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from 'lib/admin/users/registerUser';
import { AdminUser } from 'types/admin';

export async function POST(request: NextRequest): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const { username, password } = await request.json();
    const data = await registerUser(username, password);
    return NextResponse.json({ error: null, admins: [data] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
