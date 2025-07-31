import { supabaseAdmin } from 'lib/supabase';
import { type Category } from 'types/category';
import { logAdminActivity, createCategoryMessage } from 'utils/adminActivityLogger';

export default async function updateCategory(category: Category, adminUserId?: string, requestInfo = {}): Promise<Category | null> {
  const { error } = await supabaseAdmin
    .from('categories')
    .update({
      name: category.name,
      description: category.description,
      parent_id: category.parentId || null,
      level: category.level,
      path: category.path,
      is_active: category.isActive,
    })
    .eq('id', category.id);

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'category',
      entity_id: category.id,
      table_name: 'categories',
      message: createCategoryMessage('update', category.name),
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error updating category:', error);
    return null;
  }

  return category;
}
