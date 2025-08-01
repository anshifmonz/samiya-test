import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createCategoryMessage } from 'utils/adminActivityLogger';

export default async function deleteCategory(categoryId: string, adminUserId?: string, requestInfo = {}): Promise<{ success: boolean, error: string | null, status?: number }> {
  if (!categoryId || typeof categoryId !== 'string')
    return { success: false, error: 'Category ID is required and must be a string', status: 400 };

  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('name')
    .eq('id', categoryId)
    .single();

  const categoryName = category?.name || 'Unknown Category';

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'category',
      entity_id: categoryId,
      table_name: 'categories',
      message: createCategoryMessage('delete', categoryName),
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category', status: 500 };
  }
  return { success: true, error: null, status: 200 };
}
