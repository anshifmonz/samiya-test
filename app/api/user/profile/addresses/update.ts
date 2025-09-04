import { NextRequest } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { updateAddress, setDefaultAddress } from 'lib/api/user/profile/address';
import { err, jsonResponse } from 'utils/api/response';
import { AddressFormData } from 'types/address';

export async function PUT(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!addressId) return jsonResponse(err('Address ID is required', 400));

    if (action === 'set-default') {
      const result = await setDefaultAddress(addressId, user.id);
      if (result.error) return jsonResponse(result);
      return jsonResponse(result);
    }

    const addressData: Partial<AddressFormData> = await request.json();
    const result = await updateAddress(addressId, user.id, addressData);
    if (result.error) return jsonResponse(result);

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse(err('Internal server error', 500));
  }
}
