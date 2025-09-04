import { RefundEntity } from 'cashfree-pg';
import { getCashfreeInstance } from './cashfree.config';
import { ApiResponse, err, ok } from 'utils/api/response';

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
    return ok(null);
  } catch (_) {
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
