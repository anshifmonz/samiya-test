import { getServerUser } from 'utils/getServerSession';
import { getUserAddresses } from 'lib/user/profile/address';
import { err, jsonResponse } from 'utils/api/response';

export async function GET() {
  const user = await getServerUser();
  if (!user) return jsonResponse(err('Unauthorized access', 401));

  const result = await getUserAddresses(user.id);
  return jsonResponse(result);
}
