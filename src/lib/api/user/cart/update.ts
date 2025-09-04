import { supabaseAdmin } from 'lib/supabase';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!cartItemId || typeof cartItemId !== 'string')
    return err('Cart Item ID is required and must be a string', 400);
  if (!quantity || typeof quantity !== 'number' || quantity <= 0)
    return err('Valid quantity (greater than 0) is required', 400);
  if (quantity > 100) return err('Quantity cannot exceed 100', 400);

  const { data: cartItem, error: cartItemError } = await supabaseAdmin
    .from('cart_items')
    .select(
      `
      id,
      cart_id,
      product_id,
      color_id,
      size_id,
      carts!inner(user_id)
    `
    )
    .eq('id', cartItemId)
    .eq('carts.user_id', userId)
    .single();

  if (cartItemError) {
    if (cartItemError.code === 'PGRST116')
      return err('Cart item not found or does not belong to this user', 404);
    return err();
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
      return err('This color and size combination is not available for this product', 400);
    return err();
  }

  if (colorSizeCombo.stock_quantity < quantity)
    return err(`Only ${colorSizeCombo.stock_quantity} items available in stock`, 400);

  const { error: updateError } = await supabaseAdmin
    .from('cart_items')
    .update({
      quantity
    })
    .eq('id', cartItemId);

  if (updateError) return err();
  return ok('');
}

export default updateCartItemQuantity;
