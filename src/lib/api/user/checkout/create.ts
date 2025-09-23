import { createClient } from 'lib/supabase/server';
import { err, ok, ApiResponse } from 'utils/api/response';

export async function createCheckout(userId: string): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);

  const supabase = createClient();

  const { data, error } = await supabase.rpc('create_checkout_rpc', {
    p_user_id: userId
  });

  if (error) return err('Failed to create checkout', 500);

  const resp = data as any;
  if (!resp?.success) return err(resp?.error || 'Checkout creation failed', resp?.status || 500);

  return ok({ checkoutId: resp.checkout_id }, 201);
}
