import { supabasePublic } from 'lib/supabasePublic';
import type { CategoryWithProducts } from 'types/category';
import { ok, err, type ApiResponse } from 'utils/api/response';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const getCategoryProducts = async (
  categoryId: string,
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<CategoryWithProducts>> => {
  try {
    const { data, error } = await supabasePublic.rpc('get_category_with_products', {
      p_category_id: categoryId,
      p_limit: limit,
      p_offset: offset
    });

    if (error) return err('Failed to fetch category products', 500);
    return ok(data);
  } catch (_) {
    return err();
  }
};
