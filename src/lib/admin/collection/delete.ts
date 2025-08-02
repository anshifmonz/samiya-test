import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createCollectionMessage } from 'utils/adminActivityLogger';

export default async function deleteCollection(collectionId: string, adminUserId?: string, requestInfo = {}): Promise<{ success: boolean, error: string | null, status?: number }> {
  if (!collectionId || typeof collectionId !== 'string')
    return { success: false, error: 'Collection ID is required and must be a string', status: 400 };

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
    logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'collection',
      entity_id: collectionId,
      table_name: 'collections',
      message: createCollectionMessage('delete', collectionTitle),
      error: error || null,
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: 'Failed to delete collection', status: 500 };
  }
  return { success: true, error: null, status: 200 };
}
