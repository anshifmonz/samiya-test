import { createClient } from 'lib/supabase/server';
import { verifyPhone } from 'lib/firebase/verifyPhone';
import { AddressFormData, Address } from 'types/address';
import { ok, err, type ApiResponse } from 'utils/api/response';
import { addressSchema } from 'lib/validators/address';

export async function updateAddress(
  addressId: string,
  userId: string,
  userPhone: string,
  addressData: Partial<AddressFormData>
): Promise<ApiResponse<Address>> {
  const validationResult = addressSchema.partial().safeParse(addressData);
  if (!validationResult.success) {
    const message = validationResult.error.errors
      .map(e => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    return err(message);
  }

  const dataToUpdate = { ...validationResult.data };

  if (dataToUpdate.phone) {
    let isPhoneVerified = false;
    if (userPhone && userPhone.endsWith(dataToUpdate.phone)) isPhoneVerified = true;
    if (!isPhoneVerified && addressData.verifyToken && dataToUpdate.phone)
      isPhoneVerified = await verifyPhone(addressData.verifyToken, dataToUpdate.phone);
    (dataToUpdate as any).is_phone_verified = isPhoneVerified;
  }

  const supabase = createClient();
  const { data: updatedAddress, error } = await supabase
    .from('addresses')
    .update(dataToUpdate)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) return err('Failed to update address');
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
