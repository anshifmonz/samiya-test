import { supabaseAdmin } from 'lib/supabase';
import { type Section } from 'types/section';
import { logAdminActivity, createSectionMessage } from 'utils/adminActivityLogger';

export default async function updateSection(section: Section, adminUserId?: string, requestInfo = {}) :Promise<{ section: Section | null, error: string | null, status?: number }> {
  if (!section.id || typeof section.id !== 'string')
    return { section: null, error: 'Section ID is required and must be a string', status: 400 };
  if (!section.title || typeof section.title !== 'string')
    return { section: null, error: 'Title is required and must be a string', status: 400 };
  if (section.title.trim().length === 0)
    return { section: null, error: 'Title cannot be empty', status: 400 };

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
    logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'section',
      entity_id: section.id,
      table_name: 'sections',
      message: createSectionMessage('update', section.title),
      error: error || null,
      status: error != null || data == null ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error || !data) {
    console.error('Error updating section:', error);
    return { section: null, error: 'Failed to update section', status: 500 };
  }

  const updatedSection = {
    id: data.id,
    title: data.title,
    isActive: data.is_active,
    sortOrder: data.sort_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  return { section: updatedSection, error: null, status: 200 };
}

export async function reorderSections(sectionIds: string[], adminUserId?: string, requestInfo = {}): Promise<{ success: boolean, error: string | null, status: number }> {
  if (!sectionIds || !Array.isArray(sectionIds) || sectionIds.length === 0)
    return { success: false, error: 'Section IDs are required and must be a non-empty array', status: 400 };

  const { error } = await supabaseAdmin.rpc('reorder_sections', {
    section_ids: sectionIds
  });

  const success = !error;

  if (adminUserId) {
    logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'section',
      table_name: 'sections',
      message: `Reordered ${sectionIds.length} sections`,
      status: success ? 'success' : 'failed',
      metadata: { sectionIds },
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error reordering sections:', error);
    return { success: false, error: 'Failed to reorder sections', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}
