import '@supabase/supabase-js';
import { createClient } from 'lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { err, jsonResponse } from 'lib/utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@'))
      return jsonResponse(err('Valid email is required', 400))
    if (!password || typeof password !== 'string')
      return jsonResponse(err('Password is required'))

    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return jsonResponse(err(error.message, 401));

    const response = NextResponse.json({ message: 'Sign in successful' }, { status: 200 });

    if (session) {
      response.cookies.set('auth-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: session.expires_in
      });

      response.cookies.set('refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      });
    }

    return response;
  } catch (_) {
    return jsonResponse(err());
  }
}
