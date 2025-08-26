import { getServerUser } from 'utils/getServerSession';
import { createCheckout } from 'lib/user/checkout';
import { err, jsonResponse } from 'utils/api/response';

export async function POST() {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const result = await createCheckout(user.id);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
