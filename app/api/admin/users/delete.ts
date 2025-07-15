import { NextRequest, NextResponse } from 'next/server';
import { deleteUser } from 'lib/admin/users/deleteUser';
import { AdminUser } from 'types/admin';

export async function DELETE(request: NextRequest): Promise<NextResponse<{ error: string | null; admins: AdminUser[] }>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await deleteUser(id!);
    return NextResponse.json({ error: null, admins: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error', admins: [] });
  }
}
