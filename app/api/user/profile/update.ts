import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from 'utils/getUserFromSession';
import updateUserProfile from 'lib/user/profile/update';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const updateData = await request.json();
    if (!updateData || typeof updateData !== 'object')
      return NextResponse.json({ error: 'Invalid update data' }, { status: 400 });
    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });

    try {
      const result = await updateUserProfile(user.id, updateData);

      const response: any = { message: 'Profile updated successfully' };
      if (result.profile) response.profile = result.profile;
      if (result.address) response.address = result.address;

      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
