import { supabaseAdmin } from 'lib/supabase';
import { type Section } from 'types/section';
import { logAdminActivity, createSectionMessage } from 'utils/adminActivityLogger';

export default async function createSection(section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>, adminUserId?: string, requestInfo = {}) {
  try {
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
      await logAdminActivity({
        admin_id: adminUserId,
        action: 'create',
        entity_type: 'section',
        entity_id: data?.id,
        table_name: 'sections',
        message: createSectionMessage('create', section.title),
        status: error != null || data == null ? 'failed' : 'success',
        ...requestInfo,
      });
    }

    if (error) {
      console.error('Error creating section:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      isActive: data.is_active,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
}
