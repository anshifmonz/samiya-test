import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from 'utils/getUserFromSession';
import { getUserWishlists } from 'lib/user/wishlists';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await getUserWishlists(user.id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({ wishlists: result.wishlists }, { status: 200 });
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
