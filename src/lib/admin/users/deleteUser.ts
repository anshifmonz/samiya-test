import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

export async function deleteUser(id: string, adminUserId?: string, requestInfo = {}) {
  if (!id) {
    const err: any = new Error('Admin ID is required');
    err.status = 400;
    throw err;
  }

  const { data: adminToDelete, error: fetchError } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, is_superuser')
    .eq('id', id)
    .single();

  if (fetchError || !adminToDelete) {
    const err: any = new Error('Admin not found');
    err.status = 404;
    throw err;
  }

  if (adminToDelete.is_superuser) {
    const err: any = new Error('Super admins can only delete non-super admins');
    err.status = 403;
    throw err;
  }

  const { error } = await supabaseAdmin
    .from('admin_users')
    .delete()
    .eq('id', id);

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'admin_user',
      entity_id: id,
      table_name: 'admin_users',
      message: createAdminUserMessage('delete', adminToDelete.username || 'Unknown User'),
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) throw new Error('Failed to delete admin');
  return { success: true };
}
