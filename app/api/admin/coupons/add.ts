import { NextRequest } from 'next/server';
import { createCoupon } from 'lib/api/admin/coupons/create';
import { err, jsonResponse } from 'lib/utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await createCoupon(body);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
