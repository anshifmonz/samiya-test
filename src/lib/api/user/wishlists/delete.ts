import { createClient } from 'lib/supabase/server';
import { err, ok, type ApiResponse } from 'utils/api/response';

export async function deleteWishlistItem(
  wishlistId: string,
  colorId?: string,
  sizeId?: string
): Promise<ApiResponse<null>> {
  if (!wishlistId || typeof wishlistId !== 'string')
    return err('Wishlist ID is required and must be a string', 400);

  const supabase = createClient();

  let query = supabase.from('wishlists').delete().eq('id', wishlistId);

  if (colorId && sizeId) {
    if (typeof colorId !== 'string') return err('Color ID must be a string', 400);
    if (typeof sizeId !== 'string') return err('Size ID must be a string', 400);
    query = query.eq('color_id', colorId).eq('size_id', sizeId);
  }

  const { error } = await query;
  if (error) return err();

  return ok(null, 200);
}
