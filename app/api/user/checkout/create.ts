import { getServerUser } from 'src/lib/utils/getServerSession';
import { createCheckout } from 'src/lib/api/user/checkout';
import { err, jsonResponse } from 'src/lib/utils/api/response';

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
