import { supabaseAdmin } from 'lib/supabase';
import { WishlistWithProduct } from 'types/wishlist';

export async function getUserWishlists(userId: string): Promise<{ wishlists: WishlistWithProduct[] | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string')
      return { wishlists: null, error: 'User ID is required and must be a string', status: 400 };

    const { data: wishlists, error } = await supabaseAdmin
      .from('wishlists')
      .select(`
        id,
        user_id,
        product_id,
        color_id,
        size_id,
        created_at,
        products!inner(
          id, title, description, price,
          original_price, primary_image_url, is_active,
          is_featured, short_code
        ),
        product_colors!inner(
          id, color_name, hex_code
        ),
        sizes!inner(
          id, name, description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching wishlists: ${error.message}`);

    const transformedwishlists = wishlists?.map((wishlist: any) => ({
      id: wishlist.id,
      user_id: wishlist.user_id,
      product_id: wishlist.product_id,
      color_id: wishlist.color_id,
      size_id: wishlist.size_id,
      created_at: wishlist.created_at,
      product: wishlist.products,
      color: wishlist.product_colors,
      size: wishlist.sizes
    })).filter((wishlist: any) => wishlist.product && wishlist.product.is_active) || [];

    return { wishlists: transformedwishlists as WishlistWithProduct[], error: null, status: 200 };
  } catch (error) {
    console.error('Error in getUserwishlists:', error);
    return { wishlists: null, error: 'Internal server error', status: 500 };
  }
}
