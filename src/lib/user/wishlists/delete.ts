import { supabaseAdmin } from 'lib/supabase';
import { err, ok, type ApiResponse } from 'utils/api/response';

export async function deleteWishlistItem(
  userId: string,
  wishlistId: string,
  colorId?: string,
  sizeId?: string
): Promise<ApiResponse<null>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!wishlistId || typeof wishlistId !== 'string')
    return err('Wishlist ID is required and must be a string', 400);

  let query = supabaseAdmin.from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('id', wishlistId);

  if (colorId && sizeId) {
    if (typeof colorId !== 'string') return err('Color ID must be a string', 400);
    if (typeof sizeId !== 'string') return err('Size ID must be a string', 400);
    query = query
      .eq('color_id', colorId)
      .eq('size_id', sizeId);
  }

  const { error } = await query;
  if (error) return err();

  return ok(null, 200);
}
