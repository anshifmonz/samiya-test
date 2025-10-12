import { NextRequest } from 'next/server';
import { getServerUser } from 'src/lib/utils/getServerSession';
import { createOrder } from 'src/lib/api/user/order';
import { err, jsonResponse } from 'src/lib/utils/api/response';
import { type CreateOrderRequest } from 'src/types/order';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const phone = user.user_metadata.phone_number;
    const body: CreateOrderRequest = await request.json();
    const { checkoutId, paymentMethod, orderAddressId, address } = body;

    const result = await createOrder({
      userId: user.id,
      phone,
      checkoutId,
      orderAddressId,
      paymentMethod,
      address
    });
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse(err());
  }
}
