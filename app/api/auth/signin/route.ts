import { NextRequest } from 'next/server';
import { admin } from 'lib/firebase/admin';
import { createClient } from 'lib/supabase/server';
import { supabasePublic } from 'lib/supabasePublic';
import { ok, err, jsonResponse } from 'lib/utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) return jsonResponse(err('Firebase token is required', 400));

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return jsonResponse(err('Invalid Firebase token', 401));
    }

    const phone: string = decodedToken.phone_number;
    if (!phone) return jsonResponse(err('Phone number not found in token', 400));

    const supabase = createClient();
    const email = `${phone.replace('+', '')}@phone.auth`;
    const password = phone.replace('+', '') + 'passwd';

    let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          data: {
            provider: 'firebase',
            phone_verified: true,
            phone_number: phone
          }
        }
      });

      if (signUpError) return jsonResponse(err('Failed to create user', 500));

      // Auto sign-in after signup (auto email confirmation)
      if (signUpData.session) {
        signInData = signUpData;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) return jsonResponse(err());
        signInData = data;
      }
    } else if (signInError) {
      return jsonResponse(err(signInError.message, 401));
    }

    const session = signInData?.session;
    if (!session) return jsonResponse(err());

    const { data: profileRows, error: rpcError } = await supabasePublic.rpc(
      'authenticate_user_profile',
      {
        p_uid: session.user.id,
        p_name: session.user.user_metadata?.name || '',
        p_phone: phone,
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

    return response;
  } catch (_) {
    return jsonResponse(err());
  }
}
