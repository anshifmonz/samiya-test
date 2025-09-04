import bcrypt from 'bcryptjs';
import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

export async function editUser({
  id,
  username,
  password,
  is_superuser,
  adminId,
  isSuperuser: currentIsSuperuser,
  requestInfo,
}: {
  id: string;
  username?: string;
  password?: string;
  is_superuser?: boolean;
  adminId: string;
  isSuperuser: boolean;
  requestInfo?: any;
}): Promise<{ user: any | null, error: string | null, status?: number }> {
  if (!id) return { user: null, error: 'Admin ID is required', status: 400 };

  const { data: targetAdmin, error: fetchError } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, is_superuser')
    .eq('id', id)
    .single();
  if (fetchError || !targetAdmin)
    return { user: null, error: 'Admin not found', status: 404 };

  const isEditingSelf = adminId === id;
  if (!currentIsSuperuser && !isEditingSelf)
    return { user: null, error: 'Forbidden', status: 403 };

  if (typeof is_superuser === 'boolean' && !currentIsSuperuser)
    return { user: null, error: 'Only super admins can change super admin status', status: 403 };

  if (username && !currentIsSuperuser && !isEditingSelf)
    return { user: null, error: 'Only super admins can change usernames', status: 403 };

  if (password && !currentIsSuperuser && !isEditingSelf)
    return { user: null, error: 'You can only change your own password', status: 403 };

  if (currentIsSuperuser && !isEditingSelf && targetAdmin.is_superuser) {
    if (username)
      return { user: null, error: "Super admins cannot change other super admins' usernames", status: 403 };
    if (password)
      return { user: null, error: "Super admins cannot change other super admins' passwords", status: 403 };
  }

  if (typeof is_superuser === 'boolean' && currentIsSuperuser && isEditingSelf && !is_superuser) {
    const { data: superAdmins } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('is_superuser', true);

    if (superAdmins && superAdmins.length === 1)
      return { user: null, error: 'You cannot demote yourself as the only super admin', status: 403 };
  }

  const update: any = {};
  if (username) update.username = username;
  if (password) update.password = await bcrypt.hash(password, 10);
  if (typeof is_superuser === 'boolean') update.is_superuser = is_superuser;
  if (Object.keys(update).length === 0)
    return { user: null, error: 'No fields to update', status: 400 };

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .update(update)
    .eq('id', id)
    .select('id, username, is_superuser, created_at, updated_at')
    .single();

  logAdminActivity({
    admin_id: adminId,
    action: 'update',
    entity_type: 'admin_user',
    entity_id: id,
    table_name: 'admin_users',
    message: createAdminUserMessage('update', targetAdmin.username, Object.keys(update).join(', ')),
    error: error || null,
    status: error ? 'failed' : 'success',
    metadata: { updatedFields: Object.keys(update) },
    ...(requestInfo || {}),
  });

  if (error) return { user: null, error: 'Failed to update admin', status: 500 };

  return { user: data, error: null, status: 200 };
}
