import { createClient } from 'lib/supabase/server';
import { ok, err, ApiResponse } from 'utils/api/response';

export async function bulkUpdateCartSelection(
  userId: string,
  isSelected: boolean
): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (typeof isSelected !== 'boolean') return err('isSelected must be a boolean', 400);

  const supabase = createClient();

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (cartError) {
    if (cartError.code === 'PGRST116') return err('Cart not found', 404);
    return err();
  }

  const { data, error: updateError } = await supabase
    .from('cart_items')
    .update({ is_selected: isSelected })
    .eq('cart_id', cart.id)
    .select('id');

  if (updateError) return err();
  return ok({
    success: true,
    error: null,
    status: 200,
    updatedCount: data?.length || 0
  });
}
