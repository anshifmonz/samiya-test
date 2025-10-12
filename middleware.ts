import { type NextRequest, NextResponse } from 'next/server';
import { handleAdminAuth } from 'lib/middleware/admin-auth';
import { handleUserSession } from 'lib/middleware/user-session';
import { setCommonHeaders } from 'lib/middleware/common-headers';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  setCommonHeaders(request, response);
  await handleUserSession(request, response);
  return handleAdminAuth(request, response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)']
};
