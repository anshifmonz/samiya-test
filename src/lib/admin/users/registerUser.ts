import { supabaseAdmin } from 'lib/supabase';
import bcrypt from 'bcryptjs';

export async function registerUser(username: string, password: string) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const { data: existing } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .single();
  if (existing) {
    const err: any = new Error('Username already exists');
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 10);
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({ username, password: hashed })
    .select('id, username, is_superuser, created_at, updated_at')
    .single();
  if (error) throw new Error('Failed to create admin');
  return data;
}
