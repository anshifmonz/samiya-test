import { supabase } from '@/lib/supabase';
import { Category } from '@/data/categories';

interface NewCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  path: string[];
  isActive: boolean;
}

export default async function createCategory(newCategory: NewCategoryInput): Promise<Category | null> {
  const { data, error } = await supabase
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
