import { supabaseAdmin } from 'lib/supabase';

export async function getUsers() {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, is_superuser, created_at, updated_at');
  if (error) throw new Error('Failed to fetch admins');
  return data;
}
