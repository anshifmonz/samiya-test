import { getCashfreeRefund } from 'utils/payment/cashfree';

interface Refund {
  error?: string;
  refundId?: string;
  orderId?: string;
  amount?: number;
  status?: string;
  reason?: string;
  createdAt?: string;
  processedAt?: string;
}

export async function getRefundById(
  orderId: string,
  refundId: string
): Promise<Refund> {
  const data = await getCashfreeRefund(orderId, refundId);
  if (!data || data.error) return { error: data?.error || 'Refund not found' };
  return {
    refundId: data.refund_id,
    orderId: data.order_id,
    amount: data.refund_amount,
    status: data.refund_status,
    reason: data.refund_note,
    createdAt: data.created_at,
    processedAt: data.processed_at
  };
}
