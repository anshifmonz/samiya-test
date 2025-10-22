import { CreateOrderRequest } from 'types/order';
import { createClient } from 'lib/supabase/server';
import { initiatePaymentSession } from 'lib/api/user/payment';
import { type ApiResponse, ok, err } from 'utils/api/response';

interface PaymentDetails {
  payment_session_id: string;
  cf_order_id: string;
  order_id: string;
  payment_url?: string;
}

export async function createOrder(request: CreateOrderRequest): Promise<ApiResponse<any>> {
  const { userId, phone, checkoutId, paymentMethod, orderAddressId, address, couponCode } = request;

  if (!userId || typeof userId !== 'string')
    return err('User ID is required and must be a string', 400);
  if (!checkoutId || typeof checkoutId !== 'string')
    return err('Checkout ID is required and must be a string', 400);
  if (paymentMethod && typeof paymentMethod !== 'string')
    return err('Payment method must be a string', 400);
  if (paymentMethod && !['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod))
    return err('Invalid payment method', 400);
  if (paymentMethod === 'cod') return err('Cash on delivery is not available', 400);
  if (orderAddressId && typeof orderAddressId !== 'string')
    return err('Order address ID is required and must be a string', 400);
  if (orderAddressId === 'TEMP_ID' && !address)
    return err('Address is required when using new order address', 400);
  if (couponCode && typeof couponCode !== 'string') return err('Coupon code must be a string', 400);

  const supabase = createClient();

  const { data, error } = await supabase.rpc('create_order_rpc', {
    p_user_id: userId,
    p_checkout_id: checkoutId,
    p_order_address_id: orderAddressId,
    p_payment_method: paymentMethod || 'any',
    p_address: address,
    p_save_address: address?.saveAddress || false,
    p_coupon_code: couponCode || null
  });

  if (error) return err('Failed to create order', 500);

  const resp = data as any;
  if (!resp?.success) return err(resp.error || 'Order creation failed', resp.status || 400);

  const orderId = resp.data.order_id;

  try {
    const {
      data: paymentData,
      status,
      error: paymentSessionError
    } = await initiatePaymentSession(userId, phone, orderId, paymentMethod);

    if (status !== 200 || !paymentData)
      throw new Error(paymentSessionError || 'Failed to initiate payment session.');

    const paymentDetails = paymentData as PaymentDetails;

    return ok({
      orderId,
      payment_required: true,
      payment: paymentDetails
    });
  } catch (e: any) {
    console.error(`Payment initiation failed for order ${orderId}, rolling back...`, e);

    const { error: rollbackError } = await supabase.rpc('rollback_order_creation_rpc', {
      p_order_id: orderId
    });

    if (rollbackError) {
      console.error(`CRITICAL: Order rollback failed for orderId: ${orderId}`, rollbackError);
      // If rollback fails, we are in an inconsistent state. Return a critical error.
      return err();
    }

    return err();
  }
}
