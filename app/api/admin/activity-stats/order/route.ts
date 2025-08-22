import { NextRequest } from 'next/server';
import { err, jsonResponse } from 'utils/api/response';
import { getOrderActivityStats } from 'lib/admin/activity-stats/order/get';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status_id = searchParams.get('status_id');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const result = await getOrderActivityStats(
      status_id ? Number(status_id) : 2,
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0
    );

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse(err('Server Error', 500));
  }
}
