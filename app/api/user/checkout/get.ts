import { getCheckout } from 'src/lib/api/user/checkout';
import { getServerUser } from 'src/lib/utils/getServerSession';
import { err, jsonResponse } from 'src/lib/utils/api/response';

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
