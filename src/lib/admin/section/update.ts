import { supabaseAdmin } from 'lib/supabase';
import { type Section } from 'types/section';

export default async function updateSection(section: Section) {
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

    if (error) {
      console.error('Error updating section:', error);
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
    console.error('Error updating section:', error);
    throw error;
  }
}

export async function reorderSections(sectionIds: string[]): Promise<void> {
  try {
    const { error } = await supabaseAdmin.rpc('reorder_sections', {
      section_ids: sectionIds
    });

    if (error) {
      console.error('Error reordering sections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error reordering sections:', error);
    throw error;
  }
}
