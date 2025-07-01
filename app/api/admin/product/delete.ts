import { NextRequest, NextResponse } from 'next/server';
import deleteProduct from '@/lib/admin/product/delete';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const success = await deleteProduct(body.id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
