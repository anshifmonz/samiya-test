import { NextResponse } from 'next/server';
import getActiveProductsFromSupabase from '@/lib/admin/product/get';

export async function GET() {
  try {
    const products = await getActiveProductsFromSupabase();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
