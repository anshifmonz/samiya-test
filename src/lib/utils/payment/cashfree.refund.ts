import retry from 'utils/retry';
import { RefundEntity } from 'cashfree-pg';
import { supabaseAdmin } from 'lib/supabase';
import { getCashfreeInstance } from './cashfree.config';
import { ApiResponse, err, ok } from 'utils/api/response';

const postRefund = async (orderId: string, refundId: string) => {
  const { error } = await retry(async () => {
    return supabaseAdmin
      .from('payments')
      .update({
        status: 'refunded',
        refund_id: refundId
      })
      .eq('order_id', orderId);
  }, 5);
  if (!error) return;

  const { error: statusUpdateError } = await retry(async () => {
    return supabaseAdmin
      .from('payment_status_update')
      .insert({
        order_id: orderId,
        status: 'refunded'
      });
  }, 5);
  if (statusUpdateError) console.error('payment_status_update: ' + orderId)
}

const pendingRefunds = async (orderId: string, totalAmount: number) => {
  const { error } = await retry(async () => {
    return supabaseAdmin
      .from('pending_refunds')
      .insert({
        order_id: orderId,
        total_amout: totalAmount
      });
  }, 5);
  if (error) console.error('pending_refunds: ' + orderId + ' ' + totalAmount)
}

export const createCashfreeRefund = async (
  orderId: string,
  refundId: string,
  amount: number,
  reason?: string
): Promise<ApiResponse<null>> => {
  try {
    const cashfree = getCashfreeInstance();
    await cashfree.PGOrderCreateRefund(orderId, {
      refund_amount: amount,
      refund_id: refundId,
      refund_note: reason || ''
    });
    postRefund(orderId, refundId)
    return ok(null);
  } catch (_) {
    pendingRefunds(orderId, amount)
    return err('Something went wrong while creating refund');
  }
};

export const getCashfreeRefund = async (
  orderId: string,
  refundId: string
): Promise<ApiResponse<RefundEntity>> => {
  try {
    const cashfree = getCashfreeInstance();
    const response = await cashfree.PGOrderFetchRefund(orderId, refundId);
    return ok(response.data);
  } catch (_) {
    return err('Something went wrong while fetching refund');
  }
};

export const getCashfreeRefunds = async (orderId: string): Promise<ApiResponse<RefundEntity[]>> => {
  try {
    const cashfree = getCashfreeInstance();
    const response = await cashfree.PGOrderFetchRefunds(orderId);
    return ok(response.data);
  } catch (_) {
    return err('Something went wrong while fetching refunds');
  }
};
