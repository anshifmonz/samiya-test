import { NextRequest, NextResponse } from 'next/server';
import updateCollection from '@/lib/admin/collection/update';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await updateCollection(body);
    if (!collection) {
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
    }
    return NextResponse.json({ collection });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
