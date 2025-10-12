import { createClient } from 'lib/supabase/server';
import {
  createCashfreeOrder,
  generateReturnUrl,
  type CashfreeOrderRequest
} from 'utils/payment/cashfree';
import { isExpired } from 'utils/isExpired';
import { type CreateOrderRequest } from 'types/order';
import { ok, err, ApiResponse } from 'utils/api/response';
import { cleanupExpiredReservations } from 'lib/inventory';
import { type PaymentInitiationResponse } from 'types/payment';
import { retryPaymentInitiation } from 'utils/payment/retryMechanism';
import { mapErrorToPaymentError, formatPaymentError } from 'utils/payment/errorHandling';

const ALLOWED_METHODS = new Set<CreateOrderRequest['paymentMethod']>([
  'card',
  'upi',
  'netbanking',
  'wallet'
]);

export async function initiatePaymentSession(
  userId: string,
  phone: string,
  orderId: string,
  paymentMethod?: CreateOrderRequest['paymentMethod']
): Promise<ApiResponse<PaymentInitiationResponse>> {
  try {
    const supabase = createClient();

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at
      `
      )
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError || !order) return err('Order not found', 400);
    if (order.status !== 'pending') return err('Order is not in a valid state for payment', 400);
    if (order.payment_status === 'paid') return err('Order has already been paid', 400);

    if (isExpired(order.created_at, 10)) {
      cleanupExpiredReservations();
      return err('Checkout session has expired. Please start a new checkout.', 410);
    }

    // Check if payment session already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, payment_session_id, cf_order_id, status')
      .eq('order_id', orderId)
      .eq('status', 'unpaid')
      .single();

    if (existingPayment && existingPayment.payment_session_id) {
      return ok({
        id: existingPayment.id,
        payment_session_id: existingPayment.payment_session_id,
        cf_order_id: String(existingPayment.cf_order_id || ''),
        order_id: orderId
      });
    }

    let phoneNumber = phone;
    if (!phoneNumber) {
      const { data, error } = await supabase
        .from('users')
        .select('phone')
        .eq('id', userId)
        .single();

      if (error || !data) return err('User profile not found', 404);
      phoneNumber = data.phone;
    }

    let cfPaymentMethods = '';
    if (paymentMethod) {
      if (!ALLOWED_METHODS.has(paymentMethod))
        return err('Invalid or unsupported payment method', 400);
      const cfMethodMap: Record<'card' | 'upi' | 'netbanking' | 'wallet', string> = {
        card: 'cc,dc',
        upi: 'upi',
        netbanking: 'nb',
        wallet: 'wallet'
      };
      cfPaymentMethods = cfMethodMap[paymentMethod];
    }

    const cashfreeOrderData: CashfreeOrderRequest = {
      order_id: orderId,
      order_amount: parseFloat(order.total_amount.toString()),
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_email: undefined,
        customer_phone: phoneNumber || '9999999999'
      },
      order_meta: {
        return_url: generateReturnUrl(orderId),
        payment_methods: cfPaymentMethods
      },
      order_note: `Payment for order ${orderId}`,
      order_expiry_time: new Date(Date.now() + 16 * 60 * 1000).toISOString()
    };

    // Create Cashfree order with retry mechanism
    const paymentResult = await retryPaymentInitiation(
      orderId,
      () => createCashfreeOrder(cashfreeOrderData),
      (attempt, error) => {
        console.log(
          `Payment initiation attempt ${attempt} failed for order ${orderId}:`,
          (error as any)?.message
        );
      }
    );

    if (!paymentResult.success) {
      const paymentError = mapErrorToPaymentError(
        new Error(paymentResult.error || 'Failed to initiate payment')
      );
      return err(formatPaymentError(paymentError));
    }

    // Store payment record in database
    const paymentData = {
      order_id: orderId,
      cf_order_id: String(paymentResult.data!.cf_order_id),
      payment_session_id: paymentResult.data!.payment_session_id,
      payment_amount: order.total_amount,
      payment_currency: 'INR',
      payment_gateway: 'cashfree',
      method: paymentMethod,
      status: 'unpaid',
      gateway_response: paymentResult.data
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select('id, payment_session_id, cf_order_id')
      .single();

    if (paymentError) return err();

    // Update order status to processing
    await supabase
      .from('orders')
      .update({
        status: 'pending',
        payment_method: 'cashfree',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return ok({
      id: payment.id,
      payment_session_id: payment.payment_session_id,
      cf_order_id: String(payment.cf_order_id || ''),
      order_id: orderId
    });
  } catch (error: unknown) {
    const paymentError = mapErrorToPaymentError(error);
    return err(formatPaymentError(paymentError));
  }
}
