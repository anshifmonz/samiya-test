import { supabaseAdmin } from '@/lib/supabase';

export default async function deleteCollection(collectionId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('collections')
    .delete()
    .eq('id', collectionId);
  if (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
  return true;
}
