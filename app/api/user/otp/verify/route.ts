import { NextRequest } from 'next/server';
import { getServerUser } from 'src/lib/utils/getServerSession';
import { err, jsonResponse } from 'src/lib/utils/api/response';
import verifyOtp from 'src/lib/api/user/otp/verify';

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return jsonResponse(err('Unauthorized', 401));

  const { verificationId, token, phone } = await req.json();
  if (!verificationId || !token) return jsonResponse(err('Missing verificationId or token', 400));

  const res = await verifyOtp(user.id, verificationId, token, phone);
  return jsonResponse(res);
}
