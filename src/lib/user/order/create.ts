import { supabaseAdmin } from 'lib/supabase';
import { type CreateOrderResponse } from 'types/order';
import { initiatePaymentSession } from 'lib/user/payment';

export async function createOrder(
  userId: string,
  checkoutId: string,
  shippingAddressId?: string,
  paymentMethod?: string
): Promise<CreateOrderResponse> {
  try {
    if (!userId || typeof userId !== 'string')
      return { success: false, error: 'User ID is required and must be a string', status: 400 };
    if (!checkoutId || typeof checkoutId !== 'string')
      return { success: false, error: 'Checkout ID is required and must be a string', status: 400 };
    if (paymentMethod && typeof paymentMethod !== 'string')
      return { success: false, error: 'Payment method is required and must be a string', status: 400 };
    if (paymentMethod && !['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod))
      return { success: false, error: 'Invalid payment method', status: 400 };
    if (shippingAddressId && typeof shippingAddressId !== 'string')
      return { success: false, error: 'Shipping address ID is required and must be a string', status: 400 };

    const { data, error } = await supabaseAdmin.rpc('create_order_rpc', {
      p_user_id: userId,
      p_checkout_id: checkoutId,
      p_shipping_address_id: shippingAddressId || null,
      p_payment_method: paymentMethod || null
    });

    if (error) return { success: false, error: 'Failed to create order', status: 500 };

    const resp = data as any;
    if (!resp?.success)
      return { success: false, error: resp?.error || 'Order creation failed', status: 400 };

    const orderId = resp.order_id;

    let paymentDetails: {
      payment_session_id: string;
      cf_order_id: string;
      order_id: string;
      payment_url?: string;
    } | null = null;
    let paymentError: string | undefined;

    if (paymentMethod && paymentMethod !== 'cod') {
      const { body, status } = await initiatePaymentSession(userId, orderId, paymentMethod as any);
      if (status !== 200) return { success: false, error: 'Internal server error', status: 500 };

      const data = (body as any).data as {
        payment_session_id: string;
        cf_order_id: string;
        order_id: string;
        payment_url?: string;
      };
      paymentDetails = data;
    }

    return {
      success: true,
      data: {
        orderId,
        payment_required: paymentMethod !== 'cod',
        payment: paymentDetails,
        payment_error: paymentError
      }
    };
  } catch (error) {
    return { success: false, error: 'Internal server error', status: 500 };
  }
}
