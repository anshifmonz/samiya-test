import { NextRequest, NextResponse } from 'next/server';
import { unsignSessionId, getAdminUserFromSession } from 'lib/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const response = NextResponse.next();

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin'))
    return response;

  const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
  const adminAuthCookie = request.cookies.get('admin_auth');
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const redirectToLogin = () => NextResponse.redirect(new URL('/admin/login', request.url));

  response.headers.set('x-client-ip', ip);
  response.headers.set('x-user-agent', userAgent);

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    // is admin already logged in?
    if (pathname === '/admin/login' && cookieSecret && adminAuthCookie) {
      const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
      if (!sessionId) return NextResponse.next();
      const currentAdmin = await getAdminUserFromSession(sessionId);
      if (currentAdmin)
        return NextResponse.redirect(new URL('/admin', request.url));
    }
    return response;
  }

  if (!cookieSecret) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  if (!adminAuthCookie) return redirectToLogin();
  const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
  if (!sessionId) return redirectToLogin();
  const currentAdmin = await getAdminUserFromSession(sessionId);
  if (!currentAdmin) return redirectToLogin();

  response.headers.set('x-admin-id', currentAdmin.id);
  response.headers.set('x-admin-username', currentAdmin.username);
  response.headers.set('x-admin-superuser', String(currentAdmin.is_superuser));

  if (pathname === '/api/admin') {
    if (method === 'GET') return response;

    if (method === 'POST') {
      if (!currentAdmin.is_superuser)
        return NextResponse.json({ error: 'Only super admin can add admins' }, { status: 403 });
      return response;
    }

    if (method === 'DELETE') {
      if (!currentAdmin.is_superuser)
        return NextResponse.json({ error: 'Only super admin can delete admins' }, { status: 403 });
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (id === currentAdmin.id) {
        return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 403 });
      }
      return response;
    }

    if (method === 'PATCH') return response;
  }

  if (method === 'DELETE' && pathname.startsWith('/api/admin/')) {
    if (!currentAdmin.is_superuser)
      return NextResponse.json({ error: 'Only super admin can delete entries' }, { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
