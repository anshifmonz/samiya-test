import { createClient } from 'lib/supabase/server';
import { WishlistWithProduct } from 'types/wishlist';
import { err, ok, type ApiResponse } from 'utils/api/response';

export async function getUserWishlists(): Promise<ApiResponse<WishlistWithProduct[]>> {
  const supabase = createClient();

  const { data: wishlists, error } = await supabase
    .from('wishlists')
    .select(
      `
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
    `
    )
    .order('created_at', { ascending: false });

  if (error) return err();

  const transformedwishlists =
    wishlists
      ?.map((wishlist: any) => ({
        id: wishlist.id,
        user_id: wishlist.user_id,
        product_id: wishlist.product_id,
        color_id: wishlist.color_id,
        size_id: wishlist.size_id,
        created_at: wishlist.created_at,
        product: wishlist.products,
        color: wishlist.product_colors,
        size: wishlist.sizes
      }))
      .filter((wishlist: any) => wishlist.product && wishlist.product.is_active) || [];

  return ok(transformedwishlists, 200);
}
