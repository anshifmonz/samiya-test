import { supabaseAdmin } from '../../../supabase';
import { AddressFormData, Address } from 'types/address';

export async function updateAddress(addressId: string, userId: string, addressData: Partial<AddressFormData>): Promise<Address> {
  try {
    const dataToUpdate: any = {};

    if (addressData.label !== undefined) dataToUpdate.label = addressData.label;
    if (addressData.full_name !== undefined) dataToUpdate.full_name = addressData.full_name;
    if (addressData.phone !== undefined) dataToUpdate.phone = addressData.phone;
    if (addressData.phone_secondary !== undefined) dataToUpdate.phone_secondary = addressData.phone_secondary;
    if (addressData.email !== undefined) dataToUpdate.email = addressData.email;
    if (addressData.street !== undefined) dataToUpdate.street = addressData.street;
    if (addressData.landmark !== undefined) dataToUpdate.landmark = addressData.landmark;
    if (addressData.city !== undefined) dataToUpdate.city = addressData.city;
    if (addressData.district !== undefined) dataToUpdate.district = addressData.district;
    if (addressData.state !== undefined) dataToUpdate.state = addressData.state;
    if (addressData.postal_code !== undefined) dataToUpdate.postal_code = addressData.postal_code;
    if (addressData.country !== undefined) dataToUpdate.country = addressData.country;
    if (addressData.type !== undefined) dataToUpdate.type = addressData.type;

    const { data: updatedAddress, error } = await supabaseAdmin
      .from('addresses')
      .update(dataToUpdate)
      .eq('id', addressId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to update address ${error}`);

    return updatedAddress;
  } catch (error) {
    console.error('Error in updateAddress:', error);
    throw error;
  }
}

export async function setDefaultAddress(addressId: string, userId: string): Promise<void> {
  try {
    //unset all default addresses
    await supabaseAdmin
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    // set specified address as default
    const { error } = await supabaseAdmin
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to set default address ${error}`);
  } catch (error) {
    console.error('Error in setDefaultAddress:', error);
    throw error;
  }
}
