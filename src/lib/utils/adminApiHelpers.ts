import { NextRequest } from 'next/server';

export interface AdminContext {
  adminUserId?: string;
  requestInfo: {
    request_path?: string;
    ip_address?: string;
    user_agent?: string;
  };
}

export function getAdminContext(request: NextRequest, path?: string): AdminContext {
  const adminUserId = request.headers.get('x-admin-id') || undefined;
  const ip =  request.headers.get('x-client-ip');
  const userAgent = request.headers.get('x-user-agent');

  let requestPath = path;
  if (!requestPath && request.url) {
    const url = new URL(request.url);
    requestPath = url?.pathname || 'unknown';
  }

  return {
    adminUserId,
    requestInfo: {
      request_path: requestPath,
      ip_address: ip,
      user_agent: userAgent,
    }
  };
}
