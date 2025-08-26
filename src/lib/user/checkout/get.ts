import { supabaseAdmin } from 'lib/supabase';
import { err, ok, ApiResponse } from 'utils/api/response';

export async function getCheckout(userId: string): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);

  const { data: checkout, error: checkoutError } = await supabaseAdmin
    .from('checkout')
    .select('id, status, expires_at, created_at')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .single();

  if (checkoutError) {
    if (checkoutError.code === 'PGRST116') return err('No pending checkout found', 404);
    return err();
  }

  if (new Date(checkout.expires_at + 'Z').getTime() < Date.now())
    return err('Checkout session has expired', 400);

  const { data: checkoutItems, error: itemsError } = await supabaseAdmin
    .from('checkout_items')
    .select(
      `
      id,
      product_id,
      color_id,
      size_id,
      product_title,
      product_price,
      quantity,
      products:product_id (
        primary_image_url
      ),
      product_colors:color_id (
        color_name,
        hex_code
      ),
      sizes:size_id (
        name
      )
    `
    )
    .eq('checkout_id', checkout.id);

  if (itemsError) return err();

  const total =
    checkoutItems?.reduce((sum, item) => sum + item.product_price * item.quantity, 0) || 0;

  return ok({
    checkout: {
      id: checkout.id,
      status: checkout.status,
      expiresAt: checkout.expires_at,
      createdAt: checkout.created_at
    },
    items: checkoutItems || [],
    total
  });
}
