import { supabaseAdmin } from 'lib/supabase';

export async function bulkUpdateCartSelection(userId: string, isSelected: boolean): Promise<{
  success: boolean | null,
  error: string | null,
  status?: number,
  updatedCount?: number
}> {

  try {
    if (!userId || typeof userId !== 'string') return { success: null, error: 'User ID is required and must be a string', status: 400 };
    if (typeof isSelected !== 'boolean') return { success: null, error: 'isSelected must be a boolean', status: 400 };

    const { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cartError) {
      if (cartError.code === 'PGRST116')
        return { success: null, error: 'Cart not found', status: 404 };
      throw new Error(`Database error: ${cartError.message}`);
    }

    const { data, error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ is_selected: isSelected })
      .eq('cart_id', cart.id)
      .select('id');

    if (updateError) throw new Error(`Database error: ${updateError.message}`);

    return {
      success: true,
      error: null,
      status: 200,
      updatedCount: data?.length || 0
    };
  } catch (error) {
    console.error('Error in bulkUpdateCartSelection:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
