import { supabaseAdmin } from 'lib/supabase';
import { logAdminActivity, createSectionMessage } from 'utils/adminActivityLogger';

export default async function deleteSection(sectionId: string, adminUserId?: string, requestInfo = {}) {
  try {
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
      await logAdminActivity({
        admin_id: adminUserId,
        action: 'delete',
        entity_type: 'section',
        entity_id: sectionId,
        table_name: 'sections',
        message: createSectionMessage('delete', sectionTitle),
        status: error ? 'failed' : 'success',
        ...requestInfo,
      });
    }

    if (error) {
      console.error('Error deleting section:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
}
