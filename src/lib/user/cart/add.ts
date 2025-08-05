import { supabaseAdmin } from 'lib/supabase';

export async function addToCart(userId: string, productId: string, colorId: string, sizeId: string, quantity: number): Promise<{ success: boolean | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: null, error: 'User ID is required and must be a string', status: 400 };
    if (!productId || typeof productId !== 'string')
      return { success: null, error: 'Product ID is required and must be a string', status: 400 };
    if (!colorId || typeof colorId !== 'string')
      return { success: null, error: 'Color ID is required and must be a string', status: 400 };
    if (!sizeId || typeof sizeId !== 'string')
      return { success: null, error: 'Size ID is required and must be a string', status: 400 };
    if (!quantity || typeof quantity !== 'number' || quantity <= 0)
      return { success: null, error: 'Valid quantity (greater than 0) is required', status: 400 };
    if (quantity > 100)
      return { success: null, error: 'Quantity cannot exceed 100', status: 400 };

    let { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) throw new Error(`Database error: ${cartError.message}`);

    if (!cart) {
      const { data: newCart, error: createError } = await supabaseAdmin
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();

      if (createError) throw new Error(`Database error: ${createError.message}`);
      cart = newCart;
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('price, is_active')
      .eq('id', productId)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116')
        return { success: null, error: 'Product not found', status: 404 };
      throw new Error(`Database error: ${productError.message}`);
    }

    if (!product.is_active)
      return { success: null, error: 'Product is no longer available', status: 400 };

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

    if (colorSizeCombo.stock_quantity < quantity)
      return { success: null, error: `Only ${colorSizeCombo.stock_quantity} items available in stock`, status: 400 };

    const { data: existingItem, error: existingError } = await supabaseAdmin
      .from('cart_items')
      .select('quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .eq('color_id', colorId)
      .eq('size_id', sizeId)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') throw new Error(`Database error: ${existingError.message}`);

    if (existingItem) {
      const newTotalQuantity = existingItem.quantity + quantity;
      if (newTotalQuantity > colorSizeCombo.stock_quantity) {
        return { success: null, error: `Cannot add ${quantity} more items. Only ${colorSizeCombo.stock_quantity - existingItem.quantity} more available in stock`, status: 400 };
      }

      const { error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({
          quantity: newTotalQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .eq('color_id', colorId)
        .eq('size_id', sizeId);

      if (updateError) throw new Error(`Database error: ${updateError.message}`);
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          color_id: colorId,
          size_id: sizeId,
          quantity,
          price: product.price
        });

      if (insertError) throw new Error(`Database error: ${insertError.message}`);
    }

    return { success: true, error: null, status: existingItem ? 200 : 201 };
  } catch (error) {
    console.error('Error in addToCart:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}

export default addToCart;
