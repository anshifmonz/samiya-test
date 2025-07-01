import { NextRequest, NextResponse } from 'next/server';
import deleteCategory from '@/lib/admin/category/delete';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const success = await deleteCategory(body.id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
