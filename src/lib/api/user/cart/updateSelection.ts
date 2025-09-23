import { createClient } from 'lib/supabase/server';
import { ok, err, ApiResponse } from 'utils/api/response';

export async function updateCartItemSelection(
  userId: string,
  cartItemId: string,
  isSelected: boolean
): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!cartItemId || typeof cartItemId !== 'string')
    return err('Cart Item ID is required and must be a string', 400);
  if (typeof isSelected !== 'boolean') return err('isSelected must be a boolean', 400);

  const supabase = createClient();

  const { error: cartItemError } = await supabase
    .from('cart_items')
    .select(
      `
      id,
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

  const { error: updateError } = await supabase
    .from('cart_items')
    .update({ is_selected: isSelected })
    .eq('id', cartItemId);

  if (updateError) return err();
  return ok(null);
}
