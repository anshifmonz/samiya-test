import { supabaseAdmin } from 'lib/supabase';
import { fetchCashfreeOrder, mapCashfreeStatus } from 'utils/payment/cashfree';
import { type PaymentVerificationRequest, type PaymentVerificationResponse } from 'types/payment';
import { consumeStockForUser, releaseStockForUser } from 'lib/inventory';

// Types for query results
interface PaymentWithOrder {
  id: string;
  order_id: string;
  cf_order_id: string;
  payment_session_id: string;
  status: string;
  payment_amount: number;
  gateway_response: any;
  orders: {
    id: string;
    user_id: string;
    status: string;
    payment_status: string;
  } | null;
}

export async function verifyPayment(
  userId: string,
  body: PaymentVerificationRequest
): Promise<{
  body: PaymentVerificationResponse | { error: string };
  status: number;
}> {
  try {
    const { orderId, cfOrderId } = body;

    if (!orderId && !cfOrderId)
      return {
        body: { error: 'Either orderId or cfOrderId is required' },
        status: 400
      };

    // Find payment record
    let paymentQuery = supabaseAdmin.from('payments').select(`
        id,
        order_id,
        cf_order_id,
        payment_session_id,
        status,
        payment_amount,
        gateway_response,
        orders(id, user_id, status, payment_status)
      `);

    if (orderId) {
      paymentQuery = paymentQuery.eq('order_id', orderId);
    } else {
      paymentQuery = paymentQuery.eq('cf_order_id', cfOrderId);
    }

    const { data: payment, error: paymentError } = (await paymentQuery
      .eq('orders.user_id', userId)
      .single()) as { data: PaymentWithOrder | null; error: any };

    if (paymentError || !payment || !payment.orders)
      return { body: { error: 'Payment record not found' }, status: 404 };

    if (payment.status === 'completed') {
      // Ensure stock is consumed if not already done (based on user's processing checkout)
      await consumeStockForUser(userId);

      return {
        body: {
          success: true,
          data: {
            payment_status: 'completed',
            order_status: payment.status,
            cf_order_id: payment.cf_order_id,
            payment_amount: payment.payment_amount
          }
        },
        status: 200
      };
    }

    // Fetch latest status from Cashfree
    const cashfreeResult = await fetchCashfreeOrder(payment.order_id);

    if (!cashfreeResult.success)
      return {
        body: { error: 'Failed to verify payment status' },
        status: 500
      };

    const cfOrder = cashfreeResult.data;
    const newPaymentStatus = mapCashfreeStatus(cfOrder?.order_status);

    // Side effects based on final status
    if (newPaymentStatus === 'completed') {
      await consumeStockForUser(userId);
    } else if (newPaymentStatus === 'failed') {
      await releaseStockForUser(userId);
    }

    // Update payment record with latest information
    const updateData: any = {
      status: newPaymentStatus,
      gateway_response: cfOrder,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment record:', updateError);
    }

    // Update order status based on payment status
    let orderStatus = payment.orders.status;
    let orderPaymentStatus = payment.orders.payment_status;

    if (newPaymentStatus === 'paid') {
      orderStatus = 'confirmed';
    } else if (newPaymentStatus === 'unpaid') {
      orderStatus = 'pending';
    } else if (
      newPaymentStatus === 'failed' ||
      newPaymentStatus === 'dropped'
    ) {
      orderStatus = 'cancelled';
    }

    // Update order if status changed
    if (
      orderStatus !== payment.orders.status ||
      orderPaymentStatus !== payment.orders.payment_status
    ) {
      const { error: orderUpdateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: orderStatus,
          payment_status: orderPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.order_id);

      if (orderUpdateError) console.error('Failed to update order status:', orderUpdateError);
    }

    return {
      body: {
        success: true,
        data: {
          payment_status: newPaymentStatus,
          order_status: orderStatus,
          payment_amount: payment.payment_amount,
          cf_order_id: payment.cf_order_id,
          transaction_details: cfOrder
        }
      },
      status: 200
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { body: { error: 'Internal server error' }, status: 500 };
  }
}
