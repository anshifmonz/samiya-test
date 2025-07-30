import { NextResponse } from 'next/server';
import { supabasePublic } from 'lib/supabasePublic';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: sizes, error } = await supabasePublic
      .from('sizes')
      .select('id, name, description, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching sizes:', error);
      return NextResponse.json({ error: 'Failed to fetch sizes' }, { status: 500 });
    }

    return NextResponse.json({ sizes });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
