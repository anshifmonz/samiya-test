import { ok, err, ApiResponse } from 'utils/api/response';
import { createCashfreeRefund } from 'utils/payment/cashfree';

interface Refund {
  error?: string;
  refundId?: string;
  orderId?: string;
  amount?: number;
  reason?: string;
  status?: string;
  message?: string;
}

export async function createRefund(
  orderId: string,
  amount: number,
  reason?: string
): Promise<ApiResponse<Refund>> {
  const refundId = `refund_${orderId}`;
  const result = await createCashfreeRefund(orderId, amount, reason);
  if (!result || !result.success) return err(result.error || 'Failed to create refund');
  return ok({
    refundId,
    orderId,
    amount,
    reason,
    status: 'PENDING'
  });
}
