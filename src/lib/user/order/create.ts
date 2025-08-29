import { supabaseAdmin } from 'lib/supabase';
import { type ApiResponse, ok, err } from 'utils/api/response';
import { initiatePaymentSession } from 'lib/user/payment';
import { CreateOrderRequest } from 'types/order';

export async function createOrder(request: CreateOrderRequest): Promise<ApiResponse<any>> {
  const { userId, checkoutId, paymentMethod, orderAddressId, address } = request;
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!checkoutId || typeof checkoutId !== 'string')
    return err('Checkout ID is required and must be a string', 400);
  if (paymentMethod && typeof paymentMethod !== 'string')
    return err('Payment method is required and must be a string', 400);
  if (paymentMethod && !['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod))
    return err('Invalid payment method', 400);
  if (orderAddressId && typeof orderAddressId !== 'string')
    return err('Order address ID is required and must be a string', 400);
  if (orderAddressId === 'TEMP_ID' && !address)
    return err('Address is required when using new order address', 400);

  const { data, error } = await supabaseAdmin.rpc('create_order_rpc', {
    p_user_id: userId,
    p_checkout_id: checkoutId,
    p_order_address_id: orderAddressId,
    p_payment_method: paymentMethod,
    p_address: address,
    p_save_address: address?.saveAddress || false
  });

  if (error) return err('Failed to create order', 500);

  const resp = data as any;
  if (!resp?.success) return err('Order creation failed', 400);

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

    paymentDetails = data as any as {
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
