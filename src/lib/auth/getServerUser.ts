import { createClient } from 'lib/supabase/server';

export async function getServerUser() {
  const supabase = createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}
