import { supabasePublic } from '../../supabasePublic';

interface AuthenticateUserParams {
  email: string;
  password: string;
}

interface AuthenticateResult {
  error: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    is_active: boolean;
    status: string;
    last_login: string;
  } | null;
  session: any | null;
}

async function authenticateUser({
  email,
  password,
}: AuthenticateUserParams): Promise<AuthenticateResult> {
  const { data: authData, error: authError } =
    await supabasePublic.auth.signInWithPassword({ email, password });

  if (authError)
    return { error: authError.message, user: null, session: null };
  if (!authData.user || !authData.session)
    return { error: 'Authentication failed', user: null, session: null };

  const { data: profileRows, error: rpcError } =
    await supabasePublic.rpc('authenticate_user_profile', {
      p_uid: authData.user.id,
      p_email: authData.user.email,
      p_name: authData.user.user_metadata.name || '',
      p_status: 'verified',
    });

  if (rpcError) {
    if (rpcError.message === 'account_deactivated')
      return { error: 'Account is deactivated', user: null, session: null };
    console.error('RPC Error:', rpcError);
    return { error: 'Server error', user: null, session: null };
  }

  if (!profileRows || profileRows.length === 0)
    return { error: 'User profile not found', user: null, session: null };
  const profile = profileRows[0];

  return {
    error: null,
    user: {
      id: profile.user_id,
      email: profile.user_email,
      name: profile.user_name,
      is_active: profile.user_is_active,
      status: profile.user_status,
      last_login: profile.user_last_login,
    },
    session: authData.session,
  };
}

export default authenticateUser;
