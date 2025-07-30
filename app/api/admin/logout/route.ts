import { NextRequest, NextResponse } from 'next/server';
import { removeSession, unsignSessionId } from 'lib/adminSession';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('admin_auth');
    const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
    if (cookie && cookieSecret) {
      const sessionId = await unsignSessionId(cookie.value, cookieSecret);
      if (sessionId) await removeSession(sessionId);
    }
    const res = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    res.cookies.set('admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
