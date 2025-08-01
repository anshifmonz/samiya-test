import { supabaseAdmin } from 'lib/supabase';
import bcrypt from 'bcryptjs';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

export async function registerUser(username: string, password: string, adminUserId?: string, requestInfo = {}) {
  if (!username || typeof username !== 'string')
    return { user: null, error: 'Username is required and must be a string', status: 400 };
  if (!password || typeof password !== 'string')
    return { user: null, error: 'Password is required and must be a string', status: 400 };
  if (username.trim().length === 0)
    return { user: null, error: 'Username cannot be empty', status: 400 };
  if (password.length < 6)
    return { user: null, error: 'Password must be at least 6 characters long', status: 400 };

  const { data: existing } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (existing)
    return { user: null, error: 'Username already exists', status: 409 };

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

  if (error) {
    console.error('Error creating admin user:', error);
    return { user: null, error: 'Failed to create admin', status: 500 };
  }
  return { user: data, error: null, status: 201 };
}
