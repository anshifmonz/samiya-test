import { supabasePublic } from 'lib/supabasePublic';
import type { NewCollection } from 'types/collection';
import { ok, err, type ApiResponse } from 'utils/api/response';

export const getCollections = async (
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<NewCollection[]>> => {
  try {
    const { data, error } = await supabasePublic.rpc('get_sections_with_first_product_image', {
      in_limit: limit,
      in_offset: offset
    });

    if (error) return err('Failed to fetch collections', 500);
    return ok(data);
  } catch (_) {
    return err();
  }
};
