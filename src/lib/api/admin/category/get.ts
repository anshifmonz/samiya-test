import { supabaseAdmin } from '@/lib/supabase';
import { type Category } from '@/types/category';

export default async function getCategories(): Promise<{ categories: Category[] | null, error: string | null, status?: number }> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('level', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return { categories: null, error: 'Failed to fetch categories', status: 500 };
  }

  // build a lookup from id to name
  const idToName: Record<string, string> = {};
  (data || []).forEach((row: any) => {
    idToName[String(row.id)] = row.name;
  });

  const mapped = (data || []).map((row: any) => ({
    id: String(row.id),
    name: row.name,
    description: row.description,
    parentId: row.parent_id ? String(row.parent_id) : undefined,
    level: row.level,
    path: (row.path || []).map((id: string) => idToName[id] || id),
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    children: [],
  }));

  return { categories: mapped, error: null, status: 200 };
}
