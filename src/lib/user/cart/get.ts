import { supabaseAdmin } from 'lib/supabase';

export async function getUserCart(userId: string): Promise<{ success: boolean | null, data?: any, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string') return { success: null, error: 'User ID is required and must be a string', status: 400 };

    const { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) throw new Error(`Database error: ${cartError.message}`);
    if (!cart) return { success: true, data: { items: [], total: 0 }, error: null, status: 200 };

    const { data: cartItems, error: itemsError } = await supabaseAdmin
      .from('cart_items')
      .select(`
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
      `)
      .eq('cart_id', cart.id);

    if (itemsError) throw new Error(`Database error: ${itemsError.message}`);
    if (!cartItems || cartItems.length === 0) return { success: true, data: { items: [], total: 0 }, error: null, status: 200 };

    const { data: productImages, error: imagesError } = await supabaseAdmin
      .from('product_images')
      .select('product_id, color_name, image_url, sort_order, is_primary')
      .in('product_id', cartItems.map(item => item.product_id))
      .order('sort_order', { ascending: true });

    if (imagesError) throw new Error(`Error fetching product images: ${imagesError.message}`);

    const total = cartItems.reduce((sum, item) => sum + ((item.products as any)?.price * item.quantity), 0);

    const enhancedCartItems = cartItems.map(item => {
      const colorName = (item.product_colors as any)?.color_name;
      const productId = item.product_id;

      let productImageForColor = productImages?.find(img =>
        img.product_id === productId && img.color_name === colorName && img.is_primary
      )?.image_url;

      if (!productImageForColor)
        productImageForColor = productImages?.find(img =>
          img.product_id === productId && img.color_name === colorName
        )?.image_url;

      if (!productImageForColor)
        productImageForColor = productImages?.find(img =>
          img.product_id === productId && img.is_primary
        )?.image_url;

      if (!productImageForColor)
        productImageForColor = productImages?.find(img =>
          img.product_id === productId
        )?.image_url;

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

    return {
      success: true,
      data: {
        items: enhancedCartItems,
        total
      },
      error: null,
      status: 200
    };
  } catch (error) {
    console.error('Error in getUserCart:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}

export default getUserCart;
