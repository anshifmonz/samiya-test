import { supabaseAdmin } from 'lib/supabase';

export async function deleteCartItem(userId: string, cartId: string): Promise<{ success: boolean | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: null, error: 'User ID is required and must be a string', status: 400 };

    const { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) throw new Error(`Database error: ${cartError.message}`);
    if (!cart) return { success: null, error: 'Cart not found', status: 404 };

    const { data: existingItem, error: checkError } = await supabaseAdmin
      .from('cart_items')
      .select('cart_id')
      .eq('cart_id', cart.id)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') throw new Error(`Database error: ${checkError.message}`);
    if (!existingItem) return { success: null, error: 'Item not found in cart', status: 404 };

    const { error: deleteError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', cartId);

    if (deleteError) throw new Error(`Database error: ${deleteError.message}`);

    const { error: timestampError } = await supabaseAdmin
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', cart.id);

    if (timestampError) console.warn('Failed to update cart timestamp:', timestampError.message);

    return { success: true, error: null, status: 200 };
  } catch (error) {
    console.error('Error in deleteCartItem:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}

export default deleteCartItem;
