import { supabaseAdmin } from 'lib/supabase';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function deleteCartItem(userId: string, cartId: string): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);

  const { data: cart, error: cartError } = await supabaseAdmin
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (cartError) return err();
  if (!cart) return err('Cart not found', 404);

  const { data: existingItem, error: checkError } = await supabaseAdmin
    .from('cart_items')
    .select('cart_id')
    .eq('cart_id', cart.id)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') return err();
  if (!existingItem) return err('Item not found in cart', 404);

  const { error: deleteError } = await supabaseAdmin.from('cart_items').delete().eq('id', cartId);
  if (deleteError) return err();

  const { error: timestampError } = await supabaseAdmin
    .from('carts')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', cart.id);

  if (timestampError) console.warn('Failed to update cart timestamp:', timestampError.message);

  return ok(null);
}

export default deleteCartItem;
