import { createClient } from 'lib/supabase/server';
import { AddressFormData, Address } from 'types/address';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function createAddress(
  userId: string,
  addressData: AddressFormData
): Promise<ApiResponse<Address>> {
  const dataToInsert = {
    user_id: userId,
    label: addressData.label,
    full_name: addressData.full_name,
    phone: addressData.phone,
    phone_secondary: addressData.phone_secondary,
    email: addressData.email,
    street: addressData.street,
    landmark: addressData.landmark,
    city: addressData.city,
    district: addressData.district,
    state: addressData.state,
    postal_code: addressData.postal_code,
    country: addressData.country,
    type: addressData.type || 'shipping',
    is_default: false
  };

  const supabase = createClient();

  const { data: newAddress, error } = await supabase
    .from('addresses')
    .insert(dataToInsert)
    .select('*')
    .single();

  if (error) return err();
  return ok(newAddress);
}
