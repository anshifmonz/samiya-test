import { supabaseAdmin } from 'lib/supabase';
import type { Collection, NewCollectionInput } from '@/types';
import { logAdminActivity, createCollectionMessage } from 'utils/adminActivityLogger';

export default async function createCollection(newCollection: NewCollectionInput, adminUserId?: string, requestInfo = {}): Promise<Collection | null> {
  const { data, error } = await supabaseAdmin
    .from('collections')
    .insert({
      title: newCollection.title,
      description: newCollection.description,
      image_url: newCollection.image,
      is_active: true,
    })
    .select()
    .single();

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'create',
      entity_type: 'collection',
      entity_id: data?.id,
      table_name: 'collections',
      message: createCollectionMessage('create', newCollection.title),
      status: error != null || data == null ? 'failed' : 'success',
      ...requestInfo,
    });
  }

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
