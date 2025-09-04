import { NextRequest } from 'next/server';
import { getServerUser } from 'src/lib/utils/getServerSession';
import { updateCartItemQuantity } from 'src/lib/api/user/cart';
import { err, jsonResponse } from 'src/lib/utils/api/response';

export async function PUT(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const { cartItemId, quantity } = await request.json();

    const result = await updateCartItemQuantity(user.id, cartItemId, quantity);
    if (result.error) return jsonResponse(result);

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse(err('Internal server error', 500));
  }
}
