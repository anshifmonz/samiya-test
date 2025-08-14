import { NextRequest } from 'next/server';

export interface UserContext {
  user_id?: string;
  requestInfo: {
    request_path?: string;
    ip_address?: string;
    user_agent?: string;
  };
}

export function getUserContext(request: NextRequest, path?: string): UserContext {
  const userId = request.headers.get('x-user-id') || undefined;
  const ip =  request.headers.get('x-client-ip');
  const userAgent = request.headers.get('x-user-agent');

  let requestPath = path;
  if (!requestPath && request.url) {
    const url = new URL(request.url);
    requestPath = url?.pathname || 'unknown';
  }

  return <UserContext>{
    user_id: userId,
    requestInfo: {
      request_path: requestPath,
      ip_address: ip,
      user_agent: userAgent,
    }
  };
}
