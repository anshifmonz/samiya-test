import { createClient } from 'lib/supabase/server';
import { verifyPhone } from 'lib/firebase/verifyPhone';
import { AddressFormData, Address } from 'types/address';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function updateAddress(
  addressId: string,
  userId: string,
  addressData: Partial<AddressFormData>
): Promise<ApiResponse<Address>> {
  const dataToUpdate: any = {};

  if (addressData.label !== undefined) dataToUpdate.label = addressData.label;
  if (addressData.full_name !== undefined) dataToUpdate.full_name = addressData.full_name;
  if (addressData.phone !== undefined) dataToUpdate.phone = addressData.phone;
  if (addressData.phone_secondary !== undefined)
    dataToUpdate.phone_secondary = addressData.phone_secondary;
  if (addressData.email !== undefined) dataToUpdate.email = addressData.email;
  if (addressData.street !== undefined) dataToUpdate.street = addressData.street;
  if (addressData.landmark !== undefined) dataToUpdate.landmark = addressData.landmark;
  if (addressData.city !== undefined) dataToUpdate.city = addressData.city;
  if (addressData.district !== undefined) dataToUpdate.district = addressData.district;
  if (addressData.state !== undefined) dataToUpdate.state = addressData.state;
  if (addressData.postal_code !== undefined) dataToUpdate.postal_code = addressData.postal_code;
  if (addressData.country !== undefined) dataToUpdate.country = addressData.country;
  if (addressData.type !== undefined) dataToUpdate.type = addressData.type;
  if (addressData.verifyToken && addressData.phone) {
    const isPhoneVerified = await verifyPhone(addressData.verifyToken, addressData.phone);
    dataToUpdate.is_phone_verified = isPhoneVerified;
  }

  const supabase = createClient();
  const { data: updatedAddress, error } = await supabase
    .from('addresses')
    .update(dataToUpdate)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) return err();
  return ok(updatedAddress);
}

export async function setDefaultAddress(
  addressId: string,
  userId: string
): Promise<ApiResponse<null>> {
  const supabase = createClient();
  await supabase
    .from('addresses')
    .update({
      is_default: false
    })
    .eq('user_id', userId);

  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) return err();
  return ok(null);
}
