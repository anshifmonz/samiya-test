import { supabaseAdmin } from 'lib/supabase';

export async function deleteWishlistItem(userId: string, wishlistId: string, colorId?: string, sizeId?: string): Promise<{ success: boolean | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: null, error: 'User ID is required and must be a string', status: 400 };
    if (!wishlistId || typeof wishlistId !== 'string')
      return { success: null, error: 'Wishlist ID is required and must be a string', status: 400 };

    let query = supabaseAdmin
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('id', wishlistId);

    if (colorId && sizeId) {
      if (typeof colorId !== 'string')
        return { success: null, error: 'Color ID must be a string', status: 400 };
      if (typeof sizeId !== 'string')
        return { success: null, error: 'Size ID must be a string', status: 400 };
      query = query.eq('color_id', colorId).eq('size_id', sizeId);
    }

    const { error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);

    return { success: true, error: null, status: 200 };
  } catch (error) {
    console.error('Error in deleteWishlistsItem:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
