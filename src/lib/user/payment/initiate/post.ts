import { supabaseAdmin } from 'lib/supabase';
import {
  createCashfreeOrder,
  generateReturnUrl,
  type CashfreeOrderRequest
} from 'utils/payment/cashfree';
import { mapErrorToPaymentError, formatPaymentError } from 'utils/payment/errorHandling';
import { retryPaymentInitiation } from 'utils/payment/retryMechanism';
import { type PaymentInitiationResponse } from 'types/payment';
import { cleanupExpiredReservations } from 'lib/inventory';

const ALLOWED_METHODS = new Set(['card', 'upi', 'netbanking', 'wallet']);

export async function initiatePaymentSession(
  userId: string,
  orderId: string,
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'wallet'
): Promise<{
  body: PaymentInitiationResponse | { error: string };
  status: number;
}> {
  try {
    // Fetch order details from database
    const { data: order, error: orderError } = await supabaseAdmin
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

    if (orderError || !order) return { body: { error: 'Order not found' }, status: 404 };
    if (order.status !== 'pending')
      return {
        body: { error: 'Order is not in a valid state for payment' },
        status: 400
      };
    if (order.payment_status === 'paid')
      return { body: { error: 'Order has already been paid' }, status: 400 };

    // Block payment if the reservation window has expired (15 minutes from checkout creation)
    // We locate the user's processing checkout created during createOrder()
    const { data: processingCheckout } = await supabaseAdmin
      .from('checkout')
      .select('id, expires_at')
      .eq('user_id', userId)
      .eq('status', 'processing')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!processingCheckout)
      return {
        body: { error: 'Checkout session not found for this order' },
        status: 400
      };

    if (new Date(processingCheckout.expires_at + 'Z').getTime() < Date.now()) {
      // Proactively clean up any expired reservations
      await cleanupExpiredReservations();
      return {
        body: { error: 'Checkout reservation has expired. Please re-checkout.' },
        status: 400
      };
    }

    // Check if payment session already exists
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, payment_session_id, cf_order_id, status')
      .eq('order_id', orderId)
      .eq('status', 'unpaid')
      .single();

    if (existingPayment && existingPayment.payment_session_id) {
      return {
        body: {
          success: true,
          data: {
            id: existingPayment.id,
            payment_session_id: existingPayment.payment_session_id,
            cf_order_id: String(existingPayment.cf_order_id || ''),
            order_id: orderId
          }
        },
        status: 200
      };
    }

    // Get user details for payment
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('users')
      .select('email, phone')
      .eq('id', userId)
      .single();

    if (userError || !userProfile)
      return { body: { error: 'User profile not found' }, status: 404 };

    // Validate payment method from client (no server-side default)
    if (!paymentMethod || !ALLOWED_METHODS.has(paymentMethod))
      return {
        body: { error: 'Invalid or unsupported payment method' },
        status: 400
      };

    // Map paymentMethod to Cashfree order_meta.payment_methods string format
    const cfMethodMap: Record<'card' | 'upi' | 'netbanking' | 'wallet', string> = {
      card: 'cc,dc',
      upi: 'upi',
      netbanking: 'nb',
      wallet: 'wallet'
    };

    const cfPaymentMethods = cfMethodMap[paymentMethod];

    const cashfreeOrderData: CashfreeOrderRequest = {
      order_id: orderId,
      order_amount: parseFloat(order.total_amount.toString()),
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_email: userProfile.email || undefined,
        customer_phone: userProfile.phone || '9999999999'
      },
      order_meta: {
        return_url: generateReturnUrl(orderId),
        payment_methods: cfPaymentMethods
      },
      order_note: `Payment for order ${orderId}`,
      order_expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString()
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
      return { body: { error: formatPaymentError(paymentError) }, status: 500 };
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

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert(paymentData)
      .select('id, payment_session_id, cf_order_id')
      .single();

    if (paymentError) {
      console.error('Failed to store payment record:', paymentError);
      return {
        body: { error: 'Failed to store payment information' },
        status: 500
      };
    }

    // Update order status to processing
    await supabaseAdmin
      .from('orders')
      .update({
        status: 'pending',
        payment_method: 'cashfree',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return {
      body: {
        success: true,
        data: {
          id: payment.id,
          payment_session_id: payment.payment_session_id,
          cf_order_id: String(payment.cf_order_id || ''),
          order_id: orderId
        }
      },
      status: 200
    };
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    const paymentError = mapErrorToPaymentError(error);
    return { body: { error: formatPaymentError(paymentError) }, status: 500 };
  }
}
