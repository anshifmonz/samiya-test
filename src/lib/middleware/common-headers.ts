'use client';

import { type NextRequest, type NextResponse } from 'next/server';

export function setCommonHeaders(request: NextRequest, response: NextResponse) {
  const ip =
    request.ip ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  response.headers.set('x-client-ip', ip);
  response.headers.set('x-user-agent', userAgent);
}
