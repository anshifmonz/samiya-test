import { supabaseAdmin } from '@/lib/supabase';
import { type Collection } from '@/types/collection';

export default async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabaseAdmin
    .from('collections')
    .select('id, title, description, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image_url,
  }));
}
