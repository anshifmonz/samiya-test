import { supabaseAdmin } from '@/lib/supabase';
import { type Section } from '@/types/section';

export default async function createSection(section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) {
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
