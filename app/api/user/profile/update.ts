import { NextRequest } from 'next/server';
import { getServerUser } from 'src/lib/utils/getServerSession';
import updateUserProfile from 'lib/api/user/profile/update';
import { err, jsonResponse } from 'utils/api/response';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const updateData = await request.json();
    if (!updateData || typeof updateData !== 'object')
      return jsonResponse(err('Invalid update data', 400));
    if (Object.keys(updateData).length === 0)
      return jsonResponse(err('No fields provided for update', 400));

    const result = await updateUserProfile(
      user.id,
      user.email.split('@')[0].slice(2) || null,
      updateData
    );
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
