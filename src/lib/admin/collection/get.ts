import { supabaseAdmin } from '@/lib/supabase';
import { type Collection } from '@/types/collection';

export default async function getCollections(): Promise<{ collections: Collection[] | null, error: string | null, status?: number }> {
  const { data, error } = await supabaseAdmin
    .from('collections')
    .select('id, title, description, image_url')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching collections:', error);
    return { collections: null, error: 'Failed to fetch collections', status: 500 };
  }

  const mapped = (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image_url,
  }));

  return { collections: mapped, error: null, status: 200 };
}
