import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'lib/supabase/server';
import '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@'))
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    if (!password || typeof password !== 'string')
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });

    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

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
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
