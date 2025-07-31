import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createCollectionMessage } from 'utils/adminActivityLogger';

export default async function deleteCollection(collectionId: string, adminUserId?: string, requestInfo = {}): Promise<boolean> {
  // First get collection title for logging
  const { data: collection } = await supabaseAdmin
    .from('collections')
    .select('title')
    .eq('id', collectionId)
    .single();

  const collectionTitle = collection?.title || 'Unknown Collection';

  const { error } = await supabaseAdmin
    .from('collections')
    .delete()
    .eq('id', collectionId);

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'collection',
      entity_id: collectionId,
      table_name: 'collections',
      message: createCollectionMessage('delete', collectionTitle),
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
  return true;
}
