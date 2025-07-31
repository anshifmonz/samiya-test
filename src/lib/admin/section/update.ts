import { supabaseAdmin } from 'lib/supabase';
import { type Section } from 'types/section';
import { logAdminActivity, createSectionMessage } from 'utils/adminActivityLogger';

export default async function updateSection(section: Section, adminUserId?: string, requestInfo = {}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sections')
      .update({
        title: section.title,
        is_active: section.isActive,
        sort_order: section.sortOrder,
        updated_at: new Date().toISOString()
      })
      .eq('id', section.id)
      .select()
      .single();

    if (adminUserId) {
      await logAdminActivity({
        admin_id: adminUserId,
        action: 'update',
        entity_type: 'section',
        entity_id: section.id,
        table_name: 'sections',
        message: createSectionMessage('update', section.title),
        status: error != null || data == null ? 'failed' : 'success',
        ...requestInfo,
      });
    }

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      isActive: data.is_active,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating section:', error);
    throw error;
  }
}

export async function reorderSections(sectionIds: string[], adminUserId?: string, requestInfo = {}): Promise<void> {
  try {
    const { error } = await supabaseAdmin.rpc('reorder_sections', {
      section_ids: sectionIds
    });

    if (adminUserId) {
      await logAdminActivity({
        admin_id: adminUserId,
        action: 'update',
        entity_type: 'section',
        table_name: 'sections',
        message: `Reordered ${sectionIds.length} sections`,
        status: error ? 'failed' : 'success',
        metadata: { sectionIds },
        ...requestInfo,
      });
    }

    if (error) throw error;
  } catch (error) {
    console.error('Error reordering sections:', error);
    throw error;
  }
}
