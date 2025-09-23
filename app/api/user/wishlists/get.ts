import { getUserWishlists } from 'lib/api/user/wishlists';
import { getServerUser } from 'utils/getServerSession';
import { err, jsonResponse } from 'utils/api/response';

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized', 401));

    const result = await getUserWishlists();
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
