import { createClient } from 'lib/supabase/server';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function getUserCart(userId: string): Promise<ApiResponse<any>> {
  try {
    if (!userId || typeof userId !== 'string')
      return err('User ID is required and must be a string', 400);

    const supabase = createClient();

    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) return err();
    if (!cart) return ok({ items: [], total: 0 });

    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(
        `
        id,
        cart_id,
        product_id,
        color_id,
        size_id,
        quantity,
        is_selected,
        products (
          id,
          title,
          description,
          price,
          original_price
        ),
        product_colors (
          id,
          color_name,
          hex_code
        ),
        sizes (
          id,
          name
        )
      `
      )
      .eq('cart_id', cart.id);

    if (itemsError) return err();
    if (!cartItems || cartItems.length === 0) return ok({ items: [], total: 0 });

    const { data: productImages, error: imagesError } = await supabase
      .from('product_images')
      .select('product_id, color_name, image_url, sort_order, is_primary')
      .in(
        'product_id',
        cartItems.map(item => item.product_id)
      )
      .order('sort_order', { ascending: true });

    if (imagesError) return err();

    const total = cartItems.reduce(
      (sum, item) => sum + (item.products as any)?.price * item.quantity,
      0
    );

    const enhancedCartItems = cartItems.map(item => {
      const colorName = (item.product_colors as any)?.color_name;
      const productId = item.product_id;

      let productImageForColor = productImages?.find(
        img => img.product_id === productId && img.color_name === colorName && img.is_primary
      )?.image_url;

      if (!productImageForColor)
        productImageForColor = productImages?.find(
          img => img.product_id === productId && img.color_name === colorName
        )?.image_url;

      if (!productImageForColor)
        productImageForColor = productImages?.find(
          img => img.product_id === productId && img.is_primary
        )?.image_url;

      if (!productImageForColor)
        productImageForColor = productImages?.find(img => img.product_id === productId)?.image_url;

      const finalImage = productImageForColor || '/api/placeholder/200/200';

      return {
        id: item.id,
        productId: item.product_id,
        colorId: item.color_id,
        sizeId: item.size_id,
        title: (item.products as any)?.title,
        description: (item.products as any)?.description,
        price: (item.products as any)?.price,
        originalPrice: (item.products as any)?.original_price,
        selectedSize: (item.sizes as any)?.name || 'Unknown',
        selectedColor: (item.product_colors as any)?.color_name || 'Unknown',
        colorHex: (item.product_colors as any)?.hex_code,
        quantity: item.quantity,
        image: finalImage,
        isSelected: item.is_selected
      };
    });

    return ok({
      items: enhancedCartItems,
      total
    });
  } catch (_) {
    return err('Internal server error', 500);
  }
}

export default getUserCart;
