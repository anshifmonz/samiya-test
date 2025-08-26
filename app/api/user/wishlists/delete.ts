import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { deleteWishlistItem } from 'lib/user/wishlists';
import { err, jsonResponse } from 'utils/api/response';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const body = await request.json();
    const { wishlistId, colorId, sizeId } = body;

    const result = await deleteWishlistItem(user.id, wishlistId, colorId, sizeId);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
