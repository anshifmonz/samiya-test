import { supabaseAdmin } from '@/lib/supabase';
import { type Category } from '@/types/category';
import { buildCategoryTree } from '@/lib/utils/buildCategoryTree';

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

  const categories = buildCategoryTree(data);

  return categories.filter(cat => !cat.parentId);
}
