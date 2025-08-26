import { NextRequest } from 'next/server';
import { addToCart } from 'lib/user/cart';
import { getServerUser } from 'utils/getServerSession';
import { err, jsonResponse } from 'utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401))

    const { productId, colorId, sizeId, quantity } = await request.json();

    const result = await addToCart(user.id, productId, colorId, sizeId, quantity);
    if (result.error) return jsonResponse(result);

    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
