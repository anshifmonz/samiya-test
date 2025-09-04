import { supabaseAdmin } from 'lib/supabase';
import type { Collection, NewCollectionInput } from '@/types';
import { logAdminActivity, createCollectionMessage } from 'utils/adminActivityLogger';

export default async function createCollection(newCollection: NewCollectionInput, adminUserId?: string, requestInfo = {}): Promise<{ collection: Collection | null, error: string | null, status?: number }> {
  if (!newCollection.title || typeof newCollection.title !== 'string')
    return { collection: null, error: 'Title is required and must be a string', status: 400 };
  if (!newCollection.description || typeof newCollection.description !== 'string')
    return { collection: null, error: 'Description is required and must be a string', status: 400 };
  if (!newCollection.image || typeof newCollection.image !== 'string')
    return { collection: null, error: 'Image is required and must be a string', status: 400 };

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
    logAdminActivity({
      admin_id: adminUserId,
      action: 'create',
      entity_type: 'collection',
      entity_id: data?.id,
      table_name: 'collections',
      message: createCollectionMessage('create', newCollection.title),
      error: error || null,
      status: error != null || data == null ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error || !data) {
    console.error('Error creating collection:', error);
    return { collection: null, error: 'Failed to create collection', status: 500 };
  }

  const collection = {
    id: data.id,
    title: data.title,
    description: data.description,
    image: data.image_url,
  };
  return { collection, error: null, status: 201 };
}
