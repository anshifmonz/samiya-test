import { supabaseAdmin } from '@/lib/supabase';
import { type Category } from '@/types/category';

export default async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('level', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Map to Category type and build tree
  const categories: Category[] = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    parentId: row.parent_id || undefined,
    level: row.level,
    path: row.path || [],
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    children: [],
  }));

  // Build tree structure
  const categoryMap = new Map<string, Category>();
  categories.forEach(cat => categoryMap.set(cat.id, cat));
  categories.forEach(cat => {
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      categoryMap.get(cat.parentId)!.children!.push(cat);
    }
  });

  // Return only root categories (level 0)
  return categories.filter(cat => !cat.parentId);
}
