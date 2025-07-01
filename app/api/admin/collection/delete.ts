import { NextRequest, NextResponse } from 'next/server';
import deleteCollection from '@/lib/admin/collection/delete';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const success = await deleteCollection(body.id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
