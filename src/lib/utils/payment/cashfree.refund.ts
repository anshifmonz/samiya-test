import { getCashfreeInstance } from './cashfree.config';

export const createCashfreeRefund = async (
  orderId: string,
  refundId: string,
  amount: number,
  reason?: string
): Promise<any> => {
  try {
    const cashfree = getCashfreeInstance();
    await cashfree.PGOrderCreateRefund(orderId, {
      refund_amount: amount,
      refund_id: refundId,
      refund_note: reason || ''
    });
    return {
      success: true,
      message: 'Refund created successfully'
    };
  } catch (_) {
    return { success: false, error: 'Something went wrong' };
  }
};

export const getCashfreeRefund = async (orderId: string, refundId: string): Promise<any> => {
  try {
    const cashfree = getCashfreeInstance();
    const response = await cashfree.PGOrderFetchRefund(orderId, refundId);
    return response.data;
  } catch (_) {
    return { success: false, error: 'Something went wrong' };
  }
};

export const getCashfreeRefunds = async (orderId: string): Promise<any> => {
  try {
    const cashfree = getCashfreeInstance();
    const response = await cashfree.PGOrderFetchRefunds(orderId);
    return response.data;
  } catch (_) {
    return { success: false, error: 'Something went wrong' };
  }
};
