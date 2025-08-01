import { supabaseAdmin } from 'lib/supabase';
import type { Category, NewCategoryInput } from '@/types';
import { logAdminActivity, createCategoryMessage } from 'utils/adminActivityLogger';

export default async function createCategory(newCategory: NewCategoryInput, adminUserId?: string, requestInfo = {}): Promise<{ category: Category | null, error: string | null, status?: number }> {
  if (!newCategory.name || typeof newCategory.name !== 'string')
    return { category: null, error: 'Name is required and must be a string', status: 400 };
  if (newCategory.level === undefined || typeof newCategory.level !== 'number')
    return { category: null, error: 'Level is required and must be a number', status: 400 };
  if (!newCategory.path || !Array.isArray(newCategory.path))
    return { category: null, error: 'Path is required and must be an array', status: 400 };

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name: newCategory.name,
      description: newCategory.description,
      parent_id: newCategory.parentId || null,
      level: newCategory.level,
      path: newCategory.path,
      is_active: newCategory.isActive,
    })
    .select()
    .single();

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'create',
      entity_type: 'category',
      entity_id: data?.id,
      table_name: 'categories',
      message: createCategoryMessage('create', newCategory.name),
      status: error != null || data == null ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error || !data) {
    console.error('Error creating category:', error);
    return { category: null, error: 'Failed to create category', status: 500 };
  }

  const category = {
    id: data.id,
    name: data.name,
    description: data.description,
    parentId: data.parent_id || undefined,
    level: data.level,
    path: data.path || [],
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    children: [],
  };

  return { category, error: null, status: 201 };
}
