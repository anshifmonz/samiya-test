import { getCheckout } from 'lib/user/checkout';
import { getServerUser } from 'utils/getServerSession';
import { err, jsonResponse } from 'utils/api/response';

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const result = await getCheckout(user.id);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
