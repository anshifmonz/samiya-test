import { ok, err, ApiResponse } from 'utils/api/response';
import { getCashfreeRefunds } from 'utils/payment/cashfree';

interface Refund {
  refundId: string;
  orderId: string;
  amount: number;
  status: string;
  reason?: string;
  createdAt: string;
  processedAt?: string;
}

interface RefundResponse {
  error?: string;
  refunds: Refund[];
}

export async function getRefundsForOrder(orderId: string): Promise<ApiResponse<RefundResponse>> {
  const { data, error } = await getCashfreeRefunds(orderId);
  if (error || !data) return err(error || 'No refunds found');

  return ok({
    refunds: data.map((r: any) => ({
      refundId: r.refund_id,
      orderId: r.order_id,
      amount: r.refund_amount,
      status: r.refund_status,
      reason: r.refund_note,
      createdAt: r.created_at,
      processedAt: r.processed_at
    }))
  });
}
