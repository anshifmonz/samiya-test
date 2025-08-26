import { NextRequest } from 'next/server';
import { getUserFromSession } from 'utils/getUserFromSession';
import { getUserWishlists } from 'lib/user/wishlists';
import { err, jsonResponse } from 'utils/api/response';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const result = await getUserWishlists(user.id);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
