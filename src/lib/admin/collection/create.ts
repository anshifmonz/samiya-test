import { supabase } from '@/lib/supabase';
import { Collection } from '@/data/collections';

interface NewCollectionInput {
  title: string;
  description: string;
  image: string;
}

export default async function createCollection(newCollection: NewCollectionInput): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      title: newCollection.title,
      description: newCollection.description,
      image_url: newCollection.image,
      is_active: true,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating collection:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    image: data.image_url,
  };
}
