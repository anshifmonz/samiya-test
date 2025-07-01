import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { type Category } from '@/types/category';

export default async function updateCategory(category: Category): Promise<Category | null> {
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

  if (error) {
    console.error('Error updating category:', error);
    return null;
  }

  return category;
}
