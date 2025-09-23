import getUserProfile from 'lib/api/user/profile/get';
import { jsonResponse } from 'utils/api/response';

export async function GET() {
  const profile = await getUserProfile();
  return jsonResponse(profile);
}
