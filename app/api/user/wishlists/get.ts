import { getUserWishlists } from 'lib/api/user/wishlists';
import { err, jsonResponse } from 'utils/api/response';

export async function GET() {
  try {
    const result = await getUserWishlists();
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
