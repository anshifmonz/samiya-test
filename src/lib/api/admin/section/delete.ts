import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createSectionMessage } from 'utils/adminActivityLogger';

export default async function deleteSection(sectionId: string, adminUserId?: string, requestInfo = {}) :Promise<{ success: boolean, error: string | null, status?: number }> {
  if (!sectionId || typeof sectionId !== 'string')
    return { success: false, error: 'Section ID is required and must be a string', status: 400 };

  const { data: section } = await supabaseAdmin
    .from('sections')
    .select('title')
    .eq('id', sectionId)
    .single();

  const sectionTitle = section?.title || 'Unknown Section';

  const { error } = await supabaseAdmin
    .from('sections')
    .delete()
    .eq('id', sectionId);

  if (adminUserId) {
    logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'section',
      entity_id: sectionId,
      table_name: 'sections',
      message: createSectionMessage('delete', sectionTitle),
      error: error || null,
      status: error ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error deleting section:', error);
    return { success: false, error: 'Failed to delete section', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}
