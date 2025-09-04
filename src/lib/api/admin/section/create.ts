import { supabaseAdmin } from 'lib/supabase';
import { type Section } from 'types/section';
import { logAdminActivity, createSectionMessage } from 'utils/adminActivityLogger';

export default async function createSection(section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>, adminUserId?: string, requestInfo = {}) :Promise<{ section: Section | null, error: string | null, status?: number }> {
  if (!section.title || typeof section.title !== 'string')
    return { section: null, error: 'Title is required and must be a string', status: 400 };
  if (section.title.trim().length === 0)
    return { section: null, error: 'Title cannot be empty', status: 400 };

  const { data, error } = await supabaseAdmin
    .from('sections')
    .insert({
      title: section.title,
      is_active: section.isActive ?? true,
      sort_order: section.sortOrder ?? 0
    })
    .select()
    .single();

  if (adminUserId) {
    logAdminActivity({
      admin_id: adminUserId,
      action: 'create',
      entity_type: 'section',
      entity_id: data?.id,
      table_name: 'sections',
      message: createSectionMessage('create', section.title),
      error: error || null,
      status: error != null || data == null ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error || !data) {
    console.error('Error creating section:', error);
    return { section: null, error: 'Failed to create section', status: 500 };
  }

  const createdSection = {
    id: data.id,
    title: data.title,
    isActive: data.is_active,
    sortOrder: data.sort_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  return { section: createdSection, error: null, status: 201 };
}
