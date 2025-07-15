import { NextResponse } from 'next/server';
import { getUsers } from 'lib/admin/users/getUsers';
import { AdminUser } from 'types/admin';

export async function GET(): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const data = await getUsers();
    return NextResponse.json({ error: null, admins: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
