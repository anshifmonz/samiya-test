import { NextResponse } from 'next/server';
import getCategories from '@/lib/admin/category/get';

export async function GET() {
  try {
    const { categories, error, status } = await getCategories();
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ categories }, { status: status || 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
