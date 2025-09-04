import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { deleteAddress } from 'lib/api/user/profile/address';
import { err, jsonResponse } from 'utils/api/response';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    if (!addressId) return jsonResponse(err('Address ID is required', 400));

    const result = await deleteAddress(addressId, user.id);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
