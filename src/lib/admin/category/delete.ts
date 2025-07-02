import { supabaseAdmin } from '@/lib/supabase';

export default async function deleteCategory(categoryId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', categoryId);
  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }
  return true;
}
