import { supabaseAdmin } from 'lib/supabase';

export async function getUsers() :Promise<{ users: any[] | null, error: string | null, status: number }> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, is_superuser, created_at, updated_at');
  if (error) return { users: null, error: 'Failed to fetch admins', status: 500 };
  return { users: data, error: null, status: 200 };
}
