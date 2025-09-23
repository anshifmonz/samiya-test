import { UserProfile } from 'types/user';
import { createClient } from 'lib/supabase/server';
import { err, ok, type ApiResponse } from 'utils/api/response';

async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('users')
    .select(
      `
      id,
      name,
      email,
      profile_picture,
      signup_date
    `
    )
    .single();

  if (error) return err();
  if (!profile) return err('Profile not found', 404);
  return ok(profile, 200);
}

export default getUserProfile;
