import { NextRequest, NextResponse } from 'next/server';
import { type Section } from '@/types/section';
import updateSection from '@/lib/admin/section/update';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const section = await updateSection(body as Section);
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error in PUT /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}
