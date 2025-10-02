import { createClient } from 'lib/supabase/server';
import { type ApiResponse, ok, err } from 'utils/api/response';
import { initiatePaymentSession } from 'lib/api/user/payment';
import { CreateOrderRequest } from 'types/order';

interface PaymentDetails {
  payment_session_id: string;
  cf_order_id: string;
  order_id: string;
  payment_url?: string;
}

export async function createOrder(request: CreateOrderRequest): Promise<ApiResponse<any>> {
  const { userId, checkoutId, paymentMethod, orderAddressId, address } = request;
  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!checkoutId || typeof checkoutId !== 'string')
    return err('Checkout ID is required and must be a string', 400);
  if (paymentMethod && typeof paymentMethod !== 'string')
    return err('Payment method must be a string', 400);
  if (paymentMethod && !['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod))
    return err('Invalid payment method', 400);
  if (orderAddressId && typeof orderAddressId !== 'string')
    return err('Order address ID is required and must be a string', 400);
  if (orderAddressId === 'TEMP_ID' && !address)
    return err('Address is required when using new order address', 400);

  const supabase = createClient();

  const { data, error } = await supabase.rpc('create_order_rpc', {
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

  const orderId = resp.data.order_id;

  let paymentDetails: PaymentDetails | null = null;
  let paymentError: string | undefined;

  if (paymentMethod === 'cod') return err('Cash on delivery is not available', 400);

  const { data: paymentData, status } = await initiatePaymentSession(
    userId,
    orderId,
    paymentMethod !== undefined ? paymentMethod : undefined
  );
  if (status !== 200) return err();

  paymentDetails = paymentData as PaymentDetails;

  return ok({
    orderId,
    payment_required: true,
    payment: paymentDetails,
    payment_error: paymentError
  });
}
