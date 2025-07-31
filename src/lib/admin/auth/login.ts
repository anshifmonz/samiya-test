import bcrypt from 'bcryptjs';
import { supabaseAdmin } from 'lib/supabase';
import { AdminUser } from 'types/admin';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

const login = async (username: string, password: string, requestInfo = {}): Promise<{ adminUser: AdminUser, error: string }> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, password, is_superuser, created_at, updated_at')
      .eq('username', username)
      .maybeSingle();

    if (error) return { adminUser: null, error: 'Server error' };
    if (!data) return { adminUser: null, error: 'Invalid username or password' };
    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) return { adminUser: null, error: 'Invalid username or password' };

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

    return {
      adminUser,
      error: null
    };
  } catch (error) {
    console.error('Login error:', error);
    return { adminUser: null, error: 'Server error' };
  }
};

export default login;
