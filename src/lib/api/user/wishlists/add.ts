import { createClient } from 'lib/supabase/server';
import { err, ok, type ApiResponse } from 'utils/api/response';

export async function addToWishlists(
  userId: string,
  productId: string,
  colorId: string,
  sizeId: string
): Promise<ApiResponse<null>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!productId || typeof productId !== 'string')
    return err('Product ID is required and must be a string', 400);
  if (!colorId || typeof colorId !== 'string')
    return err('Color ID is required and must be a string', 400);
  if (!sizeId || typeof sizeId !== 'string')
    return err('Size ID is required and must be a string', 400);

  const supabase = createClient();

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, is_active')
    .eq('id', productId)
    .single();

  if (productError) {
    if (productError.code === 'PGRST116') return err('Product not found', 404);
    return err();
  }

  if (!product.is_active) return err('Product is not available', 400);

  const { data: color, error: colorError } = await supabase
    .from('product_colors')
    .select('id')
    .eq('id', colorId)
    .eq('product_id', productId)
    .single();

  if (colorError) {
    if (colorError.code === 'PGRST116') return err('Color not found for this product', 404);
    return err();
  }

  const { data: size, error: sizeError } = await supabase
    .from('sizes')
    .select('id')
    .eq('id', sizeId)
    .single();

  if (sizeError) {
    if (sizeError.code === 'PGRST116') return err('Size not found', 404);
    return err();
  }

  const { data: existingWishlist, error: fetchError } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('color_id', colorId)
    .eq('size_id', sizeId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') return err();
  if (existingWishlist) return ok(null, 200);

  const { error } = await supabase.from('wishlists').insert({
    user_id: userId,
    product_id: productId,
    color_id: colorId,
    size_id: sizeId
  });

  if (error) return err();
  return ok(null, 201);
}
