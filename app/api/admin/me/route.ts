import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromSession, unsignSessionId } from 'lib/adminSession';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('admin_auth');
    const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
    const sessionId = await unsignSessionId(cookie.value, cookieSecret);
    const currentAdmin = await getAdminUserFromSession(sessionId);
    return NextResponse.json({ error: null, admin: currentAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', admin: null }, { status: 500 });
  }
}
