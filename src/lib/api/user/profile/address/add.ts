import { createClient } from 'lib/supabase/server';
import { verifyPhone } from 'lib/firebase/verifyPhone';
import { AddressFormData, Address } from 'types/address';
import { ok, err, type ApiResponse } from 'utils/api/response';
import { addressSchema } from 'lib/validators/address';

export async function createAddress(
  userId: string,
  userPhone: string | null,
  addressData: AddressFormData
): Promise<ApiResponse<Address>> {
  const validationResult = addressSchema.safeParse(addressData);
  if (!validationResult.success) {
    const message = validationResult.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    return err(message);
  }

  const validatedData = validationResult.data;

  let isPhoneVerified = false;

  if (userPhone && userPhone.endsWith(validatedData.phone)) isPhoneVerified = true;
  if (!isPhoneVerified && addressData.verifyToken)
    isPhoneVerified = await verifyPhone(addressData.verifyToken, validatedData.phone);

  const dataToInsert = {
    user_id: userId,
    label: validatedData.label,
    full_name: validatedData.full_name,
    phone: validatedData.phone,
    phone_secondary: validatedData.phone_secondary,
    email: validatedData.email,
    street: validatedData.street,
    landmark: validatedData.landmark,
    city: validatedData.city,
    district: validatedData.district,
    state: validatedData.state,
    postal_code: validatedData.postal_code,
    country: validatedData.country,
    type: validatedData.type || 'shipping',
    is_phone_verified: isPhoneVerified,
    is_default: false
  };

  const supabase = createClient();

  const { data: newAddress, error } = await supabase
    .from('addresses')
    .insert(dataToInsert)
    .select('*')
    .single();

  if (error) return err('Failed to create address');
  return ok(newAddress);
}
