import { supabaseAdmin } from 'lib/supabase';
import { type Category } from 'types/category';
import { logAdminActivity, createCategoryMessage } from 'utils/adminActivityLogger';

export default async function updateCategory(category: Category, adminUserId?: string, requestInfo = {}): Promise<{ category: Category | null, error: string | null, status?: number }> {
  if (!category.id || typeof category.id !== 'string')
    return { category: null, error: 'Category ID is required and must be a string', status: 400 };
  if (!category.name || typeof category.name !== 'string')
    return { category: null, error: 'Name is required and must be a string', status: 400 };
  if (category.level === undefined || typeof category.level !== 'number')
    return { category: null, error: 'Level is required and must be a number', status: 400 };
  if (!category.path || !Array.isArray(category.path))
    return { category: null, error: 'Path is required and must be an array', status: 400 };

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
    return { category: null, error: 'Failed to update category', status: 500 };
  }

  return { category, error: null, status: 200 };
}
