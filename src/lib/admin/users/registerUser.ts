import { supabaseAdmin } from 'lib/supabase';
import bcrypt from 'bcryptjs';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

export async function registerUser(username: string, password: string, adminUserId?: string, requestInfo = {}) {
  if (!username || !password) throw new Error('Username and password are required');

  const { data: existing } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

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

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'create',
      entity_type: 'admin_user',
      entity_id: data?.id,
      table_name: 'admin_users',
      message: createAdminUserMessage('create', username),
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) throw new Error('Failed to create admin');
  return data;
}
