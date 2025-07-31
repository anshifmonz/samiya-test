import { supabaseAdmin } from 'lib/supabase';
import { type Collection } from 'types/collection';
import { logAdminActivity, createCollectionMessage } from 'utils/adminActivityLogger';

export default async function updateCollection(collection: Collection, adminUserId?: string, requestInfo = {}): Promise<Collection | null> {
  const { error } = await supabaseAdmin
    .from('collections')
    .update({
      title: collection.title,
      description: collection.description,
      image_url: collection.image,
    })
    .eq('id', collection.id);

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'collection',
      entity_id: collection.id,
      table_name: 'collections',
      message: createCollectionMessage('update', collection.title),
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error updating collection:', error);
    return null;
  }

  return collection;
}
