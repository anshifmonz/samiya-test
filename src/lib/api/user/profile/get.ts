import { supabaseAdmin } from 'lib/supabase';
import { UserProfile } from 'types/user';
import { err, ok, type ApiResponse } from 'utils/api/response';

async function getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  const { data: profile, error } = await supabaseAdmin
    .from('users')
    .select(
      `
      id, name, email, profile_picture, signup_date
    `
    )
    .eq('id', userId)
    .single();

  if (error) return err();
  if (!profile) return err('Profile not found', 404);
  return ok(profile, 200);
}

export default getUserProfile;
