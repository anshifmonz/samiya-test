import { NextRequest, NextResponse } from 'next/server';
import getSections, { getSectionsWithProducts } from 'lib/admin/section/get';

export async function GET(request: NextRequest) {
  try {
    const withProducts = request.nextUrl.searchParams.get('withProducts') === 'true';

    if (withProducts) {
      const { sections, error, status } = await getSectionsWithProducts();
      if (error) return NextResponse.json({ error }, { status: status || 500 });
      return NextResponse.json({ sections }, { status: status || 200 });
    } else {
      const { sections, error, status } = await getSections();
      if (error) return NextResponse.json({ error }, { status: status || 500 });
      return NextResponse.json({ sections }, { status: status || 200 });
    }
  } catch (error) {
    console.error('Error in GET /api/admin/section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
