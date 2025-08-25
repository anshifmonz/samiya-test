import { v4 as uuidv4 } from 'uuid';
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
  const refundId = `refund_${uuidv4()}`;
  const result = await createCashfreeRefund(orderId, refundId, amount, reason);
  if (!result || !result.success) return err(result.error || 'Failed to create refund');
  return ok({
    refundId,
    orderId,
    amount,
    reason,
    status: 'PENDING',
    message: result.message
  });
}
