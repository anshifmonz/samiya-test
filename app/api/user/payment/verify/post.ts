import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { verifyPayment } from 'lib/api/user/payment';
import { err, jsonResponse } from 'utils/api/response';

export async function POST(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return jsonResponse(err('Unauthorized', 401));

  const body = await request.json();
  const result = await verifyPayment(user.id, body);
  return jsonResponse(result);
}
