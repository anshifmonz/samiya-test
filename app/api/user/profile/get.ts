import { NextRequest } from 'next/server';
import { getUserFromSession } from 'utils/getUserFromSession';
import getUserProfile from 'lib/user/profile/get';
import { err, jsonResponse } from 'utils/api/response';

export async function GET(request: NextRequest) {
  const user = await getUserFromSession(request);
  if (!user) return jsonResponse(err('Unauthorized access', 401));

  const profile = await getUserProfile(user.id);
  return jsonResponse(profile);
}
