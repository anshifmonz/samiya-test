import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { addToWishlists } from 'lib/user/wishlists';
import { err, jsonResponse } from 'utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const body = await request.json();
    const { productId, colorId, sizeId } = body;

    const result = await addToWishlists(user.id, productId, colorId, sizeId);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
