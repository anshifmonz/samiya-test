import { supabaseAdmin } from 'lib/supabase';
import { err, ok, ApiResponse } from 'utils/api/response';

export async function createDirectCheckout(
  userId: string,
  productId: string,
  colorId: string,
  sizeId: string,
  quantity: number
): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string') return err();
  if (!productId || !colorId || !sizeId || !quantity)
    return err('Required details are missing', 400);

  const { data, error } = await supabaseAdmin.rpc('direct_checkout_rpc', {
    p_user_id: userId,
    p_product_id: productId,
    p_color_id: colorId,
    p_size_id: sizeId,
    p_quantity: quantity
  });

  if (error) return err('Failed to create direct checkout', 500);

  const resp = data as any;
  if (!resp?.success)
    return err(resp?.error || 'Direct checkout creation failed', resp?.status || 500);

  return ok({ checkoutId: resp.checkout_id }, 201);
}
