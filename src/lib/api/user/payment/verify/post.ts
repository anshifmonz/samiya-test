import retry from 'utils/retry';
import { createClient } from 'lib/supabase/server';
import { ok, err, type ApiResponse } from 'utils/api/response';
import { consumeStock, releaseStock } from 'lib/inventory';
import { fetchCashfreeOrder, mapCashfreeStatus } from 'utils/payment/cashfree';

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
    checkout_id: string;
  } | null;
}

export async function verifyPayment(
  userId: string,
  body: { orderId?: string; cfOrderId?: string }
): Promise<ApiResponse<any>> {
  try {
    const { orderId, cfOrderId } = body;
    if (!orderId && !cfOrderId) return err('Either orderId or cfOrderId is required', 400);
    if (orderId && typeof orderId !== 'string') return err('Input must be a string', 400);
    if (cfOrderId && typeof cfOrderId !== 'string') return err('Input must be a string', 400);

    const supabase = createClient();

    // Find payment record
    let paymentQuery = supabase.from('payments').select(`
        id,
        order_id,
        cf_order_id,
        payment_session_id,
        status,
        payment_amount,
        gateway_response,
        orders(id, user_id, checkout_id, status, payment_status)
      `);

    if (orderId) {
      paymentQuery = paymentQuery.eq('order_id', orderId);
    } else {
      paymentQuery = paymentQuery.eq('cf_order_id', cfOrderId);
    }

    const { data: payment, error: paymentError } = (await paymentQuery.single()) as {
      data: PaymentWithOrder | null;
      error: any;
    };

    if (paymentError || !payment || !payment.orders) return err('Payment record not found', 400);

    const checkoutId = payment.orders.checkout_id;
    if (payment.status === 'paid') {
      await consumeStock(checkoutId);

      return ok({
        payment_status: 'paid',
        order_status: payment.status,
        cf_order_id: payment.cf_order_id,
        payment_amount: payment.payment_amount
      });
    }

    // Fetch latest status from Cashfree
    const cashfreeResult = await fetchCashfreeOrder(payment.order_id);

    if (!cashfreeResult.success) return err('Failed to verify payment status');

    const cfOrder = cashfreeResult.data;
    const newPaymentStatus = mapCashfreeStatus(cfOrder?.order_status);

    // Side effects based on final status
    if (newPaymentStatus === 'paid') {
      await consumeStock(checkoutId);
    } else if (newPaymentStatus === 'failed') {
      await releaseStock(checkoutId);
    }

    // Update payment record with latest information
    const updateData: any = {
      status: newPaymentStatus,
      gateway_response: cfOrder,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment record:', updateError);
    }

    // Update order status based on payment status
    let orderStatus = payment.orders.status;
    let orderPaymentStatus = payment.orders.payment_status;

    if (newPaymentStatus === 'paid' || newPaymentStatus === 'unpaid') {
      orderStatus = 'pending';
    } else if (newPaymentStatus === 'failed' || newPaymentStatus === 'dropped') {
      orderStatus = 'cancelled';
    }

    // Update order if status changed
    if (orderStatus !== payment.orders.status || orderPaymentStatus !== newPaymentStatus) {
      const { error: orderUpdateError } = await retry(async () => {
        return await supabase
          .from('orders')
          .update({
            status: orderStatus,
            payment_status: newPaymentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.order_id), 3, 1000
      });

      if (orderUpdateError) console.error('Failed to update order status:', orderUpdateError);
    }

    return ok({
      payment_status: newPaymentStatus,
      order_status: orderStatus,
      payment_amount: payment.payment_amount,
      cf_order_id: payment.cf_order_id,
      transaction_details: cfOrder
    });
  } catch (_) {
    return err();
  }
}
