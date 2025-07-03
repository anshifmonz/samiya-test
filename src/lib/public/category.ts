import { supabasePublic } from '@/lib/supabasePublic';

const getCategories = async () => {
  const { data, error } = await supabasePublic
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
};

export default getCategories;
