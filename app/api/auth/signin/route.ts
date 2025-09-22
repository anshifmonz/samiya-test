import '@supabase/supabase-js';
import { createClient } from 'lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { err, jsonResponse } from 'lib/utils/api/response';
import { supabasePublic } from 'lib/supabasePublic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@'))
      return jsonResponse(err('Valid email is required', 400));
    if (!password || typeof password !== 'string') return jsonResponse(err('Password is required'));

    const supabase = createClient();
    const {
      data: { session },
      error
    } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return jsonResponse(err(error.message, 401));

    const { data: profileRows, error: rpcError } = await supabasePublic.rpc(
      'authenticate_user_profile',
      {
        p_uid: session.user.id,
        p_email: session.user.email,
        p_name: session.user.user_metadata.name || '',
        p_status: 'verified'
      }
    );

    if (rpcError) {
      if (rpcError.message === 'account_deactivated')
        return { error: 'Account is deactivated', user: null, session: null };
      console.error('RPC Error:', rpcError);
      return { error: 'Server error', user: null, session: null };
    }
    if (!profileRows || profileRows.length === 0)
      return jsonResponse(err('User profile not found', 404));
    const profile = profileRows[0];

    const response = NextResponse.json(
      { data: profile, message: 'Sign in successful' },
      { status: 200 }
    );

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
