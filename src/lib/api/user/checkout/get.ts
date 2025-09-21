import { supabaseAdmin } from 'lib/supabase';
import { type CheckoutData } from 'types/checkout';
import { isExpired } from 'utils/isExpired';
import { ok, err, ApiResponse } from 'utils/api/response';

export async function getCheckout(userId: string): Promise<ApiResponse<CheckoutData>> {
  const { data: checkout, error: checkoutError } = await supabaseAdmin
    .from('checkout')
    .select('id, status, created_at')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .single();

  if (checkoutError) {
    if (checkoutError.code === 'PGRST116') return err('No pending checkout found', 404);
    return err();
  }

  if (isExpired(checkout.created_at, 30)) return err('Checkout session has expired', 410);

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

  // Fetch product images for all items
  const productIds = (checkoutItems || []).map(item => item.product_id);

  const { data: productImages, error: imagesError } = await supabaseAdmin
    .from('product_images')
    .select('product_id, color_name, image_url, sort_order, is_primary')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true });

  if (imagesError) return err();

  const enhancedCheckoutItems = (checkoutItems || []).map(item => {
    const colorName = (item.product_colors as any)?.color_name;
    const productId = item.product_id;

    let productImageForColor = productImages?.find(
      img => img.product_id === productId && img.color_name === colorName && img.is_primary
    )?.image_url;

    if (!productImageForColor)
      productImageForColor = productImages?.find(
        img => img.product_id === productId && img.color_name === colorName
      )?.image_url;

    if (!productImageForColor)
      productImageForColor = productImages?.find(
        img => img.product_id === productId && img.is_primary
      )?.image_url;

    if (!productImageForColor)
      productImageForColor = productImages?.find(img => img.product_id === productId)?.image_url;

    const finalImage = productImageForColor || '/api/placeholder/200/200';

    return {
      id: item.id,
      productId: item.product_id,
      colorId: item.color_id,
      sizeId: item.size_id,
      title: item.product_title,
      price: item.product_price,
      quantity: item.quantity,
      selectedColor: colorName || 'Unknown',
      colorHex: (item.product_colors as any)?.hex_code,
      selectedSize: (item.sizes as any)?.name || 'Unknown',
      image: finalImage
    };
  });

  const total =
    enhancedCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return ok({
    checkout: {
      id: checkout.id,
      status: checkout.status,
      createdAt: checkout.created_at
    },
    items: enhancedCheckoutItems,
    total
  });
}
