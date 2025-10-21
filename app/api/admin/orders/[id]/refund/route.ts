import { err, ok, jsonResponse } from 'utils/api/response';
import { createCashfreeRefund } from 'utils/payment/cashfree.refund';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const { amount, reason } = await request.json();

  if (!orderId) return jsonResponse(err('Order ID is required', 400));
  if (!amount || !reason) return jsonResponse(err('Amount and reason are required', 400));

  const { data, error } = await createCashfreeRefund(
    orderId,
    `refund_${Date.now()}`,
    amount,
    reason
  );

  if (error) return jsonResponse(err('Failed to initiate refund'));
  return jsonResponse(ok({ message: 'Refund processing initiated' }));
}
