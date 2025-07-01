import { NextRequest, NextResponse } from 'next/server';
import updateProduct from '@/lib/admin/product/update';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await updateProduct(body);
    if (!product) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
