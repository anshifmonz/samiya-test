import { supabaseAdmin } from 'lib/supabase';

export async function updateCartItemSelection(userId: string, cartItemId: string, isSelected: boolean): Promise<{ success: boolean | null, error: string | null, status?: number }> {
  try {
    if (!userId || typeof userId !== 'string') return { success: null, error: 'User ID is required and must be a string', status: 400 };
    if (!cartItemId || typeof cartItemId !== 'string') return { success: null, error: 'Cart Item ID is required and must be a string', status: 400 };
    if (typeof isSelected !== 'boolean') return { success: null, error: 'isSelected must be a boolean', status: 400 };

    const { error: cartItemError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
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

    const { error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ is_selected: isSelected })
      .eq('id', cartItemId);

    if (updateError) throw new Error(`Database error: ${updateError.message}`);

    return { success: true, error: null, status: 200 };
  } catch (error) {
    console.error('Error in updateCartItemSelection:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
