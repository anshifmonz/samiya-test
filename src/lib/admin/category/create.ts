import { supabaseAdmin } from 'lib/supabase';
import type { Category, NewCategoryInput } from '@/types';
import { logAdminActivity, createCategoryMessage } from 'utils/adminActivityLogger';

export default async function createCategory(newCategory: NewCategoryInput, adminUserId?: string, requestInfo = {}): Promise<Category | null> {
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
    return null;
  }

  return {
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
}
