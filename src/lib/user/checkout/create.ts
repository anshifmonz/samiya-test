import { supabaseAdmin } from 'lib/supabase';

export async function createCheckout(userId: string): Promise<{
  success: boolean | null;
  error: string | null;
  status?: number;
  checkoutId?: string;
  expiresAt?: string;
}> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: null, error: 'User ID is required and must be a string', status: 400 };

    const { data, error } = await supabaseAdmin.rpc('create_checkout_rpc', {
      p_user_id: userId
    });

    if (error) return { success: null, error: 'Failed to create checkout', status: 500 };

    const resp = data as any;
    if (!resp?.success)
      return {
        success: resp?.success ?? null,
        error: resp?.error ?? 'Checkout creation failed',
        status: resp?.status ?? 500
      };

    return {
      success: true,
      error: null,
      status: 201,
      checkoutId: resp.checkout_id,
      expiresAt: resp.expires_at
    };
  } catch (error) {
    console.error('Error in createCheckout:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
