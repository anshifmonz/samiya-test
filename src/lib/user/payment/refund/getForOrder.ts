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

export async function getRefundsForOrder(orderId: string): Promise<RefundResponse> {
  const { data, error } = await getCashfreeRefunds(orderId);
  if (error || !data) return { error: error || 'No refunds found', refunds: [] };

  return {
    refunds: data.map((r: any) => ({
      refundId: r.refund_id,
      orderId: r.order_id,
      amount: r.refund_amount,
      status: r.refund_status,
      reason: r.refund_note,
      createdAt: r.created_at,
      processedAt: r.processed_at
    }))
  };
}
