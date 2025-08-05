import { supabaseAdmin } from 'lib/supabase';

export async function updateCartItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<{ success: boolean | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: null, error: 'User ID is required and must be a string', status: 400 };
    if (!cartItemId || typeof cartItemId !== 'string')
      return { success: null, error: 'Cart Item ID is required and must be a string', status: 400 };
    if (!quantity || typeof quantity !== 'number' || quantity <= 0)
      return { success: null, error: 'Valid quantity (greater than 0) is required', status: 400 };
    if (quantity > 100)
      return { success: null, error: 'Quantity cannot exceed 100', status: 400 };

    const { data: cartItem, error: cartItemError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        color_id,
        size_id,
        carts!inner(user_id)
      `)
      .eq('id', cartItemId)
      .eq('carts.user_id', userId)
      .single();

    if (cartItemError) {
      if (cartItemError.code === 'PGRST116')
        return { success: null, error: 'Cart item not found or does not belong to this user', status: 404 };
      throw new Error(`Database error: ${cartItemError.message}`);
    }

    const { product_id: productId, color_id: colorId, size_id: sizeId } = cartItem;

    const { data: colorSizeCombo, error: comboError } = await supabaseAdmin
      .from('product_color_sizes')
      .select('stock_quantity')
      .eq('product_id', productId)
      .eq('color_id', colorId)
      .eq('size_id', sizeId)
      .single();

    if (comboError) {
      if (comboError.code === 'PGRST116')
        return { success: null, error: 'This color and size combination is not available for this product', status: 400 };
      throw new Error(`Database error: ${comboError.message}`);
    }

    if (colorSizeCombo.stock_quantity < quantity) return { success: null, error: `Only ${colorSizeCombo.stock_quantity} items available in stock`, status: 400 };

    const { error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({
        quantity
      })
      .eq('id', cartItemId);

    if (updateError) throw new Error(`Database error: ${updateError.message}`);

    return { success: true, error: null, status: 200 };
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}

export default updateCartItemQuantity;
