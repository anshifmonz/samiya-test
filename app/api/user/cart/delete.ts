import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { deleteCartItem } from 'lib/user/cart';
import { err, jsonResponse } from 'utils/api/response';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const { cartId } = await request.json();

    const result = await deleteCartItem(user.id, cartId);
    if (result.error) return jsonResponse(result);

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse(err('Internal server error', 500));
  }
}
