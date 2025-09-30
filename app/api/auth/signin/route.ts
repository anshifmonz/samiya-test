import '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { createClient } from 'lib/supabase/server';
import { supabasePublic } from 'lib/supabasePublic';
import { ok, err, jsonResponse } from 'lib/utils/api/response';

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
        return jsonResponse(err('Account is deactivated', 403));
      console.error('RPC Error:', rpcError);
      return jsonResponse(err('Server error'));
    }
    if (!profileRows || profileRows.length === 0)
      return jsonResponse(err('User profile not found', 404));
    const profile = profileRows[0];

    const response = jsonResponse(ok(profile));

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
