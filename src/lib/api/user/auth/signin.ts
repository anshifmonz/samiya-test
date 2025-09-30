import { supabasePublic } from 'lib/supabasePublic';
import { ok, err, ApiResponse } from 'lib/utils/api/response';

interface AuthenticateUserParams {
  email: string;
  password: string;
}

interface AuthenticateResult {
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
  password
}: AuthenticateUserParams): Promise<ApiResponse<AuthenticateResult>> {
  const { data: authData, error: authError } = await supabasePublic.auth.signInWithPassword({
    email,
    password
  });

  if (authError) return err(authError.message);
  if (!authData.user || !authData.session) return err('Authentication failed');

  const { data: profileRows, error: rpcError } = await supabasePublic.rpc(
    'authenticate_user_profile',
    {
      p_uid: authData.user.id,
      p_email: authData.user.email,
      p_name: authData.user.user_metadata.name || '',
      p_status: 'verified'
    }
  );

  if (rpcError) {
    if (rpcError.message === 'account_deactivated') return err('Account is deactivated', 401);
    return err('Server error');
  }

  if (!profileRows || profileRows.length === 0) return err('User profile not found', 404);
  const profile = profileRows[0];

  return ok({
    user: {
      id: profile.user_id,
      email: profile.user_email,
      name: profile.user_name,
      is_active: profile.user_is_active,
      status: profile.user_status,
      last_login: profile.user_last_login
    },
    session: authData.session
  });
}

export default authenticateUser;
