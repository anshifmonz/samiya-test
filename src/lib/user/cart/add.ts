import { supabaseAdmin } from 'lib/supabase';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function addToCart(
  userId: string,
  productId: string,
  colorId: string,
  sizeId: string,
  quantity: number
): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!productId || typeof productId !== 'string')
    return err('Product ID is required and must be a string', 400);
  if (!colorId || typeof colorId !== 'string')
    return err('Color ID is required and must be a string', 400);
  if (!sizeId || typeof sizeId !== 'string')
    return err('Size ID is required and must be a string', 400);
  if (!quantity || typeof quantity !== 'number' || quantity <= 0)
    return err('Valid quantity (greater than 0) is required', 400);
  if (quantity > 100) return err('Quantity cannot exceed 100', 400);

  let { data: cart, error: cartError } = await supabaseAdmin
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (cartError) return err();

  if (!cart) {
    const { data: newCart, error: createError } = await supabaseAdmin
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single();

    if (createError) return err();
    cart = newCart;
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('price, is_active')
    .eq('id', productId)
    .single();

  if (productError) {
    if (productError.code === 'PGRST116') return err('Product not found', 404);
    return err();
  }

  if (!product.is_active) return err('Product is no longer available', 400);

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

  const { data: existingItem, error: existingError } = await supabaseAdmin
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .eq('color_id', colorId)
    .eq('size_id', sizeId)
    .maybeSingle();

  if (existingError && existingError.code !== 'PGRST116') return err();

  if (existingItem) {
    const newTotalQuantity = existingItem.quantity + quantity;
    if (newTotalQuantity > colorSizeCombo.stock_quantity) {
      return err(
        `Cannot add ${quantity} more items. Only ${
          colorSizeCombo.stock_quantity - existingItem.quantity
        } more available in stock`,
        400
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({
        quantity: newTotalQuantity
      })
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .eq('color_id', colorId)
      .eq('size_id', sizeId);

    if (updateError) return err();
  } else {
    const { error: insertError } = await supabaseAdmin.from('cart_items').insert({
      cart_id: cart.id,
      product_id: productId,
      color_id: colorId,
      size_id: sizeId,
      quantity
    });

    if (insertError) return err();
  }

  return ok(null, 201);
}

export default addToCart;
