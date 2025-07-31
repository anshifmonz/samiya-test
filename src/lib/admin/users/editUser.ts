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
}) {
  if (!id) {
    const err: any = new Error('Admin ID is required');
    err.status = 400;
    throw err;
  }

  const { data: targetAdmin, error: fetchError } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, is_superuser')
    .eq('id', id)
    .single();
  if (fetchError || !targetAdmin) {
    const err: any = new Error('Admin not found');
    err.status = 404;
    throw err;
  }
  const isEditingSelf = adminId === id;
  if (!currentIsSuperuser && !isEditingSelf) {
    const err: any = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  if (typeof is_superuser === 'boolean' && !currentIsSuperuser) {
    const err: any = new Error('Only super admins can change super admin status');
    err.status = 403;
    throw err;
  }

  if (username && !currentIsSuperuser && !isEditingSelf) {
    const err: any = new Error('Only super admins can change usernames');
    err.status = 403;
    throw err;
  }

  if (password && !currentIsSuperuser && !isEditingSelf) {
    const err: any = new Error('You can only change your own password');
    err.status = 403;
    throw err;
  }

  if (currentIsSuperuser && !isEditingSelf && targetAdmin.is_superuser) {
    if (username) {
      const err: any = new Error("Super admins cannot change other super admins' usernames");
      err.status = 403;
      throw err;
    }
    if (password) {
      const err: any = new Error("Super admins cannot change other super admins' passwords");
      err.status = 403;
      throw err;
    }
  }

  if (typeof is_superuser === 'boolean' && currentIsSuperuser && isEditingSelf && !is_superuser) {
    const { data: superAdmins } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('is_superuser', true);

    if (superAdmins && superAdmins.length === 1) {
      const err: any = new Error('You cannot demote yourself as the only super admin');
      err.status = 403;
      throw err;
    }
  }

  const update: any = {};
  if (username) update.username = username;
  if (password) update.password = await bcrypt.hash(password, 10);
  if (typeof is_superuser === 'boolean') update.is_superuser = is_superuser;
  if (Object.keys(update).length === 0) {
    const err: any = new Error('No fields to update');
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .update(update)
    .eq('id', id)
    .select('id, username, is_superuser, created_at, updated_at')
    .single();

  await logAdminActivity({
    admin_id: adminId,
    action: 'update',
    entity_type: 'admin_user',
    entity_id: id,
    table_name: 'admin_users',
    message: createAdminUserMessage('update', targetAdmin.username, Object.keys(update).join(', ')),
    status: error ? 'failed' : 'success',
    metadata: { updatedFields: Object.keys(update) },
    ...(requestInfo || {}),
  });

  if (error) throw new Error('Failed to update admin');
  return data;
}
