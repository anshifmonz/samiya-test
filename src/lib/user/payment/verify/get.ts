import { supabaseAdmin } from 'lib/supabase';
import { type PaymentStatusResponse } from 'types/payment';

interface PaymentStatusWithOrder {
  id: string;
  order_id: string;
  cf_order_id: string;
  status: string;
  payment_amount: number;
  created_at: string;
  orders: {
    id: string;
    user_id: string;
    status: string;
    payment_status: string;
    total_amount: number;
  } | null;
}

export async function getPaymentStatus(
  userId: string,
  orderId?: string | null,
  cfOrderId?: string | null
): Promise<{ body: PaymentStatusResponse | { error: string }; status: number }> {
  try {
    if (!orderId && !cfOrderId) {
      return { body: { error: 'Either orderId or cfOrderId is required' }, status: 400 };
    }

    let paymentQuery = supabaseAdmin
      .from('payments')
      .select(`
        id,
        order_id,
        cf_order_id,
        status,
        payment_amount,
        created_at,
        orders(id, user_id, status, payment_status, total_amount)
      `);

    if (orderId) {
      paymentQuery = paymentQuery.eq('order_id', orderId);
    } else {
      paymentQuery = paymentQuery.eq('cf_order_id', cfOrderId);
    }

    const { data: payment, error: paymentError } = await paymentQuery
      .eq('orders.user_id', userId)
      .single() as { data: PaymentStatusWithOrder | null; error: any };

    if (paymentError || !payment || !payment.orders) {
      return { body: { error: 'Payment record not found' }, status: 404 };
    }

    return {
      body: {
        success: true,
        data: {
          payment_status: payment.status,
          order_status: payment.orders.status,
          payment_amount: payment.payment_amount,
          order_amount: payment.orders.total_amount,
          cf_order_id: payment.cf_order_id,
          created_at: payment.created_at
        }
      },
      status: 200
    };
  } catch (error) {
    console.error('Payment status check error:', error);
    return { body: { error: 'Internal server error' }, status: 500 };
  }
}

