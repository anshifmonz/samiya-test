import { NextResponse } from 'next/server';
import getCollections from '@/lib/admin/collection/get';

export async function GET() {
  try {
    const collections = await getCollections();
    return NextResponse.json({ collections });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
