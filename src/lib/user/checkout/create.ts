import { supabaseAdmin } from 'lib/supabase';

export async function createCheckout(userId: string): Promise<{
  success: boolean | null,
  error: string | null,
  status?: number,
  checkoutId?: string,
  expiresAt?: string
}> {
  try {
    if (!userId || typeof userId !== 'string') return { success: null, error: 'User ID is required and must be a string', status: 400 };

    const { error: cancelError } = await supabaseAdmin
      .from('checkout')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (cancelError) throw new Error(`Database error cancelling previous sessions: ${cancelError.message}`);

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

    const { data: cartItems, error: itemsError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        product_id,
        color_id,
        size_id,
        quantity,
        products (
          id,
          title,
          price,
          is_active
        ),
        product_color_sizes (
          stock_quantity
        )
      `)
      .eq('cart_id', cart.id)
      .eq('is_selected', true);

    if (itemsError) {
      console.error('Error fetching cart items:', itemsError);
      throw new Error(`Database error: ${itemsError.message}`);
    }
    if (!cartItems || cartItems.length === 0) return { success: null, error: 'No items selected for checkout', status: 400 };

    // is all products are still active?
    const inactiveProducts = cartItems.filter(item => !(item.products as any)?.is_active);
    if (inactiveProducts.length > 0) return { success: null, error: 'Some selected products are no longer available', status: 400 };

    // is all products stock available?
    const outOfStockItems = cartItems.filter(item => {
      const stock = Array.isArray(item.product_color_sizes) ? item.product_color_sizes[0] : item.product_color_sizes;
      return stock?.stock_quantity < item.quantity;
    });
    if (outOfStockItems.length > 0)
      return {
        success: false,
        error: 'Some products in your checkout are out of stock',
        status: 400
      };

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { data: checkout, error: checkoutError } = await supabaseAdmin
      .from('checkout')
      .insert({
        user_id: userId,
        expires_at: expiresAt
      })
      .select('id')
      .single();

    if (checkoutError) throw new Error(`Database error: ${checkoutError.message}`);

    const checkoutItemsData = cartItems.map(item => ({
      checkout_id: checkout.id,
      product_id: item.product_id,
      color_id: item.color_id,
      size_id: item.size_id,
      product_title: (item.products as any).title,
      product_price: (item.products as any).price,
      quantity: item.quantity
    }));

    const { error: checkoutItemsError } = await supabaseAdmin
      .from('checkout_items')
      .insert(checkoutItemsData);

    if (checkoutItemsError) {
      await supabaseAdmin.from('checkout').delete().eq('id', checkout.id);
      throw new Error(`Database error: ${checkoutItemsError.message}`);
    }

    return {
      success: true,
      error: null,
      status: 201,
      checkoutId: checkout.id,
      expiresAt
    };
  } catch (error) {
    console.error('Error in createCheckout:', error);
    return { success: null, error: 'Internal server error', status: 500 };
  }
}
