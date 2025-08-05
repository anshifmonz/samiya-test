import { supabaseAdmin } from 'lib/supabase';

export async function addToWishlists(userId: string, productId: string, colorId: string, sizeId: string): Promise<{ success: boolean | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: null, error: 'User ID is required and must be a string', status: 400 };
    if (!productId || typeof productId !== 'string')
      return { success: null, error: 'Product ID is required and must be a string', status: 400 };
    if (!colorId || typeof colorId !== 'string')
      return { success: null, error: 'Color ID is required and must be a string', status: 400 };
    if (!sizeId || typeof sizeId !== 'string')
      return { success: null, error: 'Size ID is required and must be a string', status: 400 };

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, is_active')
      .eq('id', productId)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116')
        return { success: null, error: 'Product not found', status: 404 };
      throw new Error(`Database error: ${productError.message}`);
    }

    if (!product.is_active)
      return { success: null, error: 'Product is not available', status: 400 };

    const { data: color, error: colorError } = await supabaseAdmin
      .from('product_colors')
      .select('id')
      .eq('id', colorId)
      .eq('product_id', productId)
      .single();

    if (colorError) {
      if (colorError.code === 'PGRST116')
        return { success: null, error: 'Color not found for this product', status: 404 };
      throw new Error(`Database error: ${colorError.message}`);
    }

    const { data: size, error: sizeError } = await supabaseAdmin
      .from('sizes')
      .select('id')
      .eq('id', sizeId)
      .single();

    if (sizeError) {
      if (sizeError.code === 'PGRST116')
        return { success: null, error: 'Size not found', status: 404 };
      throw new Error(`Database error: ${sizeError.message}`);
    }

    const { data: existingWishlist, error: fetchError } = await supabaseAdmin
      .from('whislists')
      .select('product_id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('color_id', colorId)
      .eq('size_id', sizeId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116')
      throw new Error(`Database error: ${fetchError.message}`);

    if (existingWishlist) return { success: true, error: null, status: 200 };

    const { error } = await supabaseAdmin
      .from('wishlists')
      .insert({
        user_id: userId,
        product_id: productId,
        color_id: colorId,
        size_id: sizeId
      });

    if (error) throw new Error(`Database error: ${error.message}`);

    return { success: true, error: null, status: 201 };
  } catch (error) {
    console.error('Error in addToWishlists:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
