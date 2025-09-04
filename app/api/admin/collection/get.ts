import { NextResponse } from 'next/server';
import getCollections from 'lib/api/admin/collection/get';

export async function GET() {
  try {
    const { collections, error, status } = await getCollections();
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ collections }, { status: status || 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
