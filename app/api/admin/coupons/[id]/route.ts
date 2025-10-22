import { NextRequest } from 'next/server';
import { getCoupon } from 'lib/api/admin/coupons/get';
import { updateCoupon } from 'lib/api/admin/coupons/update';
import { err, jsonResponse } from 'lib/utils/api/response';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await getCoupon(Number(id));
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const result = await updateCoupon(id, body);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
