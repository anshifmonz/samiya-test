import { NextRequest } from 'next/server';
import { createAddress } from 'lib/user/profile/address';
import { getServerUser } from 'utils/getServerSession';
import { err, jsonResponse } from 'utils/api/response';
import { AddressFormData } from 'types/address';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const addressData: AddressFormData = await request.json();
    if (
      !addressData.full_name ||
      !addressData.phone ||
      !addressData.street ||
      !addressData.city ||
      !addressData.state ||
      !addressData.postal_code ||
      !addressData.country
    ) {
      return jsonResponse(err('Missing required fields', 400));
    }

    const result = await createAddress(user.id, addressData);
    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
