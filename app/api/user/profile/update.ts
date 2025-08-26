import { NextRequest } from 'next/server';
import { getUserFromSession } from 'utils/getUserFromSession';
import updateUserProfile from 'lib/user/profile/update';
import { err, jsonResponse } from 'utils/api/response';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const updateData = await request.json();
    if (!updateData || typeof updateData !== 'object')
      return jsonResponse(err('Invalid update data', 400));
    if (Object.keys(updateData).length === 0)
      return jsonResponse(err('No fields provided for update', 400));

    const result = await updateUserProfile(user.id, updateData);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
