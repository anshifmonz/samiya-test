import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { createOrder } from 'lib/user/order';
import { err, jsonResponse } from 'utils/api/response';
import { type CreateOrderRequest } from 'types/order';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const body: CreateOrderRequest = await request.json();
    const { checkoutId, shippingAddressId, paymentMethod } = body;

    const result = await createOrder(user.id, checkoutId, shippingAddressId, paymentMethod);
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse(err());
  }
}
