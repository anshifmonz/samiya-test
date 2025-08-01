import bcrypt from 'bcryptjs';
import { supabaseAdmin } from 'lib/supabase';
import { AdminUser } from 'types/admin';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

const login = async (username: string, password: string, requestInfo = {}): Promise<{ adminUser: AdminUser, error: string, status?: number }> => {
  try {
    if (!username || typeof username !== 'string')
      return { adminUser: null, error: 'Username is required and must be a string', status: 400 };
    if (!password || typeof password !== 'string')
      return { adminUser: null, error: 'Password is required and must be a string', status: 400 };

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, password, is_superuser, created_at, updated_at')
      .eq('username', username)
      .maybeSingle();

    if (error) return { adminUser: null, error: 'Server error', status: 500 };
    if (!data) return { adminUser: null, error: 'Invalid username or password', status: 401 };
    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) return { adminUser: null, error: 'Invalid username or password', status: 401 };

    const { id, username: uname, is_superuser, created_at, updated_at } = data;
    const adminUser = {
      id,
      username: uname,
      is_superuser,
      created_at,
      updated_at
    };

    // Log successful login
    await logAdminActivity({
      admin_id: id,
      action: 'login',
      entity_type: 'auth',
      message: createAdminUserMessage('login', uname),
      status: 'success',
      ...requestInfo,
    });

    return { adminUser, error: null, status: 200 };
  } catch (error) {
    console.error('Login error:', error);
    return { adminUser: null, error: 'Server error', status: 500 };
  }
};

export default login;
