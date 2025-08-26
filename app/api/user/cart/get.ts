import { getUserCart } from 'lib/user/cart';
import { getServerUser } from 'utils/getServerSession';
import { err, jsonResponse } from 'utils/api/response';

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401))

    const result = await getUserCart(user.id);
    if (result.error) return jsonResponse(result);

    return jsonResponse(result);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return jsonResponse(err('Internal server error', 500))
  }
}
