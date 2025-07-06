import { NextRequest, NextResponse } from 'next/server';
import createSection from '@/lib/admin/section/create';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const section = await createSection(body);
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error in POST /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
