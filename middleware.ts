import { NextRequest, NextResponse } from 'next/server';
import { unsignSessionId, validateSession } from '@/lib/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login' || pathname === '/api/admin/login')
    return NextResponse.next();
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin'))
    return NextResponse.next();

  const adminAuthCookie = request.cookies.get('admin_auth');
  const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
  if (!adminAuthCookie || !cookieSecret) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
  if (!sessionId || !validateSession(sessionId)) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
