import { supabaseAdmin } from 'lib/supabase';
import { UserProfile } from 'types/user';

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select(`
        id, name, email, profile_picture, signup_date
      `)
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);

    return profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

export default getUserProfile;
