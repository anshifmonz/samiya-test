import { supabaseAdmin } from 'lib/supabase';
import type { CategoryWithFirstProduct } from 'types/category';
import { ok, err, type ApiResponse } from 'utils/api/response';

export const getCategories = async (
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<CategoryWithFirstProduct[]>> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_categories_with_first_product_image', {
      in_limit: limit,
      in_offset: offset
    });

    if (error) return err('Failed to fetch categories', 500);
    return ok(data);
  } catch (_) {
    return err();
  }
};
