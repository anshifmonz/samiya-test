import { supabaseAdmin } from 'lib/supabase';
import { type Collection } from 'types/collection';
import { logAdminActivity, createCollectionMessage } from 'utils/adminActivityLogger';

export default async function updateCollection(collection: Collection, adminUserId?: string, requestInfo = {}): Promise<{ collection: Collection | null, error: string | null, status?: number }> {
  if (!collection.id || typeof collection.id !== 'string')
    return { collection: null, error: 'Collection ID is required and must be a string', status: 400 };
  if (!collection.title || typeof collection.title !== 'string')
    return { collection: null, error: 'Title is required and must be a string', status: 400 };
  if (!collection.description || typeof collection.description !== 'string')
    return { collection: null, error: 'Description is required and must be a string', status: 400 };
  if (!collection.image || typeof collection.image !== 'string')
    return { collection: null, error: 'Image is required and must be a string', status: 400 };

  const { error } = await supabaseAdmin
    .from('collections')
    .update({
      title: collection.title,
      description: collection.description,
      image_url: collection.image,
    })
    .eq('id', collection.id);

  if (adminUserId) {
    logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'collection',
      entity_id: collection.id,
      table_name: 'collections',
      message: createCollectionMessage('update', collection.title),
      error: error || null,
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error updating collection:', error);
    return { collection: null, error: 'Failed to update collection', status: 500 };
  }

  return { collection, error: null, status: 200 };
}
