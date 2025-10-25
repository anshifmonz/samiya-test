import { supabasePublic } from 'lib/supabasePublic';
import type { SectionWithProducts } from 'types/collection';
import { ok, err, type ApiResponse } from 'utils/api/response';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const getSectionProducts = async (
  sectionId: string,
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<SectionWithProducts>> => {
  try {
    const { data, error } = await supabasePublic.rpc('get_section_with_products', {
      p_section_id: sectionId,
      p_limit: limit,
      p_offset: offset
    });

    if (error) return err('Failed to fetch similar products', 500);
    return ok(data);
  } catch (_) {
    return err();
  }
};
