import { getServerUser } from 'utils/getServerSession';
import { createDirectCheckout } from 'lib/user/checkout/direct/create';
import { err, jsonResponse } from 'utils/api/response';

export async function POST(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const body = await req.json();
    const { productId, colorId, sizeId, quantity } = body;
    const result = await createDirectCheckout(user.id, productId, colorId, sizeId, quantity);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
