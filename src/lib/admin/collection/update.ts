import { supabaseAdmin } from '@/lib/supabase';
import { type Collection } from '@/types/collection';

export default async function updateCollection(collection: Collection): Promise<Collection | null> {
  const { error } = await supabaseAdmin
    .from('collections')
    .update({
      title: collection.title,
      description: collection.description,
      image_url: collection.image,
    })
    .eq('id', collection.id);

  if (error) {
    console.error('Error updating collection:', error);
    return null;
  }

  return collection;
}
