import { getCoupons } from 'lib/api/admin/coupons/get';
import { err, jsonResponse } from 'lib/utils/api/response';

export async function GET() {
  try {
    const result = await getCoupons();
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
