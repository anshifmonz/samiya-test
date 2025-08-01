import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createAdminUserMessage } from 'utils/adminActivityLogger';

export async function deleteUser(id: string, adminUserId?: string, requestInfo = {}): Promise<{ success: boolean, error: string | null, status?: number }> {
  if (!id || typeof id !== 'string')
    return { success: false, error: 'Admin ID is required and must be a string', status: 400 };

  const { data: adminToDelete, error: fetchError } = await supabaseAdmin
    .from('admin_users')
    .select('id, username, is_superuser')
    .eq('id', id)
    .single();

  if (fetchError || !adminToDelete)
    return { success: false, error: 'Admin not found', status: 404 };

  if (adminToDelete.is_superuser)
    return { success: false, error: 'Super admins can only delete non-super admins', status: 403 };

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

  if (error) {
    console.error('Error deleting admin user:', error);
    return { success: false, error: 'Failed to delete admin', status: 500 };
  }
  return { success: true, error: null, status: 200 };
}
