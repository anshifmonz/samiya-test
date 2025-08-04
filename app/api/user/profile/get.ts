import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from 'utils/getUserFromSession';
import getUserProfile from 'lib/user/profile/get';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (!profile)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
