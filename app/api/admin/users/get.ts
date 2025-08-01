import { NextResponse } from 'next/server';
import { getUsers } from 'lib/admin/users/getUsers';
import { AdminUser } from 'types/admin';

export async function GET(): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  const { users, error, status } = await getUsers();
  if (error) return NextResponse.json({ error, admins: [] }, { status: status || 500 });
  return NextResponse.json({ error: null, admins: users || [] });
}
