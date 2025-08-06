import { supabaseAdmin } from 'lib/supabase';

export async function getCheckout(userId: string): Promise<{
  success: boolean | null,
  error: string | null,
  status?: number,
  data?: any
}> {
  try {
    if (!userId || typeof userId !== 'string') return { success: null, error: 'User ID is required and must be a string', status: 400 };

    const { data: checkout, error: checkoutError } = await supabaseAdmin
      .from('checkout')
      .select('id, status, expires_at, created_at')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (checkoutError) {
      if (checkoutError.code === 'PGRST116') return { success: null, error: 'No pending checkout found', status: 404 };
        throw new Error(`Database error: ${checkoutError.message}`);
    }

    if (new Date(checkout.expires_at + 'Z').getTime() < Date.now())
      return { success: null, error: 'Checkout session has expired', status: 400 };

    const { data: checkoutItems, error: itemsError } = await supabaseAdmin
      .from('checkout_items')
      .select(`
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
      `)
      .eq('checkout_id', checkout.id);

    if (itemsError) throw new Error(`Database error: ${itemsError.message}`);

    const total = checkoutItems?.reduce((sum, item) => sum + (item.product_price * item.quantity), 0) || 0;

    return {
      success: true,
      error: null,
      status: 200,
      data: {
        checkout: {
          id: checkout.id,
          status: checkout.status,
          expiresAt: checkout.expires_at,
          createdAt: checkout.created_at
        },
        items: checkoutItems || [],
        total
      }
    };

  } catch (error) {
    console.error('Error in getCheckout:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
