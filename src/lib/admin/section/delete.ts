import { supabaseAdmin } from '@/lib/supabase';

export default async function deleteSection(sectionId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('sections')
      .delete()
      .eq('id', sectionId);

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
