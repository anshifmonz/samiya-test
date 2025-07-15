import { supabaseAdmin } from 'lib/supabase';
import bcrypt from 'bcryptjs';
import { AdminUser } from 'types/admin';

const login = async (username: string, password: string): Promise<{ adminUser: AdminUser, error: string }> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, password, is_superuser, created_at, updated_at')
      .eq('username', username)
      .single();

    if (error) return { adminUser: null, error: 'Server error' };
    if (!data) return { adminUser: null, error: 'Invalid username or password' };
    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) return { adminUser: null, error: 'Invalid username or password' };

    const { id, username: uname, is_superuser, created_at, updated_at } = data;
    return {
      adminUser: {
        id,
        username: uname,
        is_superuser,
        created_at,
        updated_at
      },
      error: null
    };
  } catch (error) {
    return { adminUser: null, error: 'Server error' };
  }
};

export default login;
