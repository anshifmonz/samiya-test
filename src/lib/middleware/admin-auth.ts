import { type NextRequest, NextResponse } from 'next/server';
import { unsignSessionId, getAdminUserFromSession } from 'lib/adminSession';

export async function handleAdminAuth(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) return response;

  const cookieSecret = process.env.COOKIE_SIGNING_SECRET;
  const adminAuthCookie = request.cookies.get('admin_auth');
  const redirectToLogin = () => NextResponse.redirect(new URL('/admin/login', request.url));

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    if (pathname === '/admin/login' && cookieSecret && adminAuthCookie) {
      const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
      if (!sessionId) return NextResponse.next();
      const currentAdmin = await getAdminUserFromSession(sessionId);
      if (currentAdmin) return NextResponse.redirect(new URL('/admin', request.url));
    }
    return response;
  }

  if (!cookieSecret)
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  if (!adminAuthCookie) return redirectToLogin();
  const sessionId = await unsignSessionId(adminAuthCookie.value, cookieSecret);
  if (!sessionId) return redirectToLogin();
  const currentAdmin = await getAdminUserFromSession(sessionId);
  if (!currentAdmin) return redirectToLogin();

  response.headers.set('x-admin-id', currentAdmin.id);
  response.headers.set('x-admin-username', currentAdmin.username);
  response.headers.set('x-admin-superuser', String(currentAdmin.is_superuser));

  if (pathname === '/api/admin' && (method === 'POST' || method === 'DELETE')) {
    if (!currentAdmin.is_superuser)
      return NextResponse.json(
        { error: `Only super admin can ${method === 'POST' ? 'add' : 'delete'} admins` },
        { status: 403 }
      );
    if (method === 'DELETE') {
      const id = request.nextUrl.searchParams.get('id');
      if (id === currentAdmin.id)
        return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 403 });
    }
  }

  if (method === 'DELETE' && pathname.startsWith('/api/admin/') && pathname !== '/api/admin') {
    if (!currentAdmin.is_superuser)
      return NextResponse.json({ error: 'Only super admin can delete entries' }, { status: 403 });
  }

  return response;
}
