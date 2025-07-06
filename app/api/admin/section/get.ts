import { NextRequest, NextResponse } from 'next/server';
import getSections, { getSectionsWithProducts } from '@/lib/admin/section/get';

export async function GET(request: NextRequest) {
  try {
    const withProducts = request.nextUrl.searchParams.get('withProducts') === 'true';

    if (withProducts) {
      const sections = await getSectionsWithProducts();
      return NextResponse.json({ sections });
    } else {
      const sections = await getSections();
      return NextResponse.json({ sections });
    }
  } catch (error) {
    console.error('Error in GET /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
