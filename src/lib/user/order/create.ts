import { supabaseAdmin } from 'lib/supabase';
import { type ApiResponse, ok, err } from 'utils/api/response';
import { initiatePaymentSession } from 'lib/user/payment';

export async function createOrder(
  userId: string,
  checkoutId: string,
  shippingAddressId?: string,
  paymentMethod?: string
): Promise<ApiResponse<any>> {
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!checkoutId || typeof checkoutId !== 'string')
    return err('Checkout ID is required and must be a string', 400);
  if (paymentMethod && typeof paymentMethod !== 'string')
    return err('Payment method is required and must be a string', 400);
  if (paymentMethod && !['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod))
    return err('Invalid payment method', 400);
  if (shippingAddressId && typeof shippingAddressId !== 'string')
    return err('Shipping address ID is required and must be a string', 400);

  const { data, error } = await supabaseAdmin.rpc('create_order_rpc', {
    p_user_id: userId,
    p_checkout_id: checkoutId,
    p_shipping_address_id: shippingAddressId || null,
    p_payment_method: paymentMethod || null
  });

  if (error) return err('Failed to create order', 500);

  const resp = data as any;
  if (!resp?.success) return err(resp?.error || 'Order creation failed', 400);

  const orderId = resp.order_id;

  let paymentDetails: {
    payment_session_id: string;
    cf_order_id: string;
    order_id: string;
    payment_url?: string;
  } | null = null;
  let paymentError: string | undefined;

  if (paymentMethod && paymentMethod !== 'cod') {
    const { data, status } = await initiatePaymentSession(userId, orderId, paymentMethod as any);
    if (status !== 200) return err();

    paymentDetails = (data as any) as {
      payment_session_id: string;
      cf_order_id: string;
      order_id: string;
      payment_url?: string;
    };
  }

  return ok({
    orderId,
    payment_required: paymentMethod !== 'cod',
    payment: paymentDetails,
    payment_error: paymentError
  });
}
