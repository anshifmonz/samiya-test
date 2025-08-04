import { supabaseAdmin } from '../../../supabase';
import { AddressFormData, Address } from 'types/address';

export async function createAddress(userId: string, addressData: AddressFormData): Promise<Address> {
  try {
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

    const { data: newAddress, error } = await supabaseAdmin
      .from('addresses')
      .insert(dataToInsert)
      .select('*')
      .single();

    if (error) throw new Error(`${error}`);

    return newAddress;
  } catch (error) {
    console.error('Error in createAddress:', error);
    throw error;
  }
}
