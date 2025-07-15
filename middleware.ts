import { NextRequest, NextResponse } from 'next/server';
import { unsignSessionId, getAdminUserFromSession } from 'lib/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (pathname === '/admin/login' || pathname === '/api/admin/login')
    return NextResponse.next();
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin'))
    return NextResponse.next();

  if (pathname === '/api/admin') {
    const adminAuthCookie = request.cookies.get('admin_auth');
    const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
    if (!adminAuthCookie || !cookieSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
    if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentAdmin = await getAdminUserFromSession(sessionId);
    if (!currentAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (method === 'GET') {
      const response = NextResponse.next();
      response.headers.set('x-admin-id', currentAdmin.id);
      response.headers.set('x-admin-superuser', String(currentAdmin.is_superuser));
      return response;
    }

    if (method === 'POST') {
      if (!currentAdmin.is_superuser)
        return NextResponse.json({ error: 'Only super admin can add admins' }, { status: 403 });
      const response = NextResponse.next();
      response.headers.set('x-admin-id', currentAdmin.id);
      response.headers.set('x-admin-superuser', String(currentAdmin.is_superuser));
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
      const response = NextResponse.next();
      response.headers.set('x-admin-id', currentAdmin.id);
      response.headers.set('x-admin-superuser', String(currentAdmin.is_superuser));
      return response;
    }

    if (method === 'PATCH') {
      const response = NextResponse.next();
      response.headers.set('x-admin-id', currentAdmin.id);
      response.headers.set('x-admin-superuser', String(currentAdmin.is_superuser));
      return response;
    }
  }

  const adminAuthCookie = request.cookies.get('admin_auth');
  const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
  if (!adminAuthCookie || !cookieSecret) return NextResponse.redirect(new URL('/admin/login', request.url));

  const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
  if (!sessionId) return NextResponse.redirect(new URL('/admin/login', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
