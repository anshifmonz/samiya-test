import { NextRequest, NextResponse } from 'next/server';
import { createSession, signSessionId } from 'lib/adminSession';
import login from 'lib/api/admin/auth/login';
import { getAdminContext } from 'utils/adminApiHelpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
    if (!cookieSecret)
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });

    const { username, password } = await request.json();

    const { requestInfo } = getAdminContext(request, '/api/admin/login');
    const { adminUser, error, status } = await login(username, password, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });

    const { sessionId } = await createSession(adminUser);
    const signedSession = await signSessionId(sessionId, cookieSecret);

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

    response.cookies.set('admin_auth', signedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 10 // 10 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
