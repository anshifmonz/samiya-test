import { createClient } from 'lib/supabase/server';
import { User } from 'types/user';
import { AddressFormData } from 'types/address';
import { createAddress, updateAddress, setDefaultAddress } from './address';
import { err, ok, type ApiResponse } from 'utils/api/response';

interface UpdateData extends Partial<User> {
  address?: any;
}

export async function handleAddressOperation(userId: string, userPhone: string, addressData: any) {
  if (typeof addressData !== 'object' || Array.isArray(addressData))
    return { error: 'Address must be an object', status: 400 };

  const { action, data, addressId } = addressData;
  if (!action || !['create', 'update', 'setDefault'].includes(action))
    return { error: 'Address action must be one of: create, update, setDefault', status: 400 };
  if (typeof data !== 'object' || Array.isArray(data))
    return { error: 'Address data must be an object', status: 400 };

  let addressResult = null;
  switch (action) {
    case 'create':
      if (!data) return { error: 'Address data is required for create action', status: 400 };
      const requiredFields = [
        'label',
        'full_name',
        'phone',
        'street',
        'city',
        'state',
        'postal_code',
        'country'
      ];
      for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === ''))
          return { error: `Address field '${field}' is required`, status: 400 };
      }

      addressResult = await createAddress(userId, userPhone, data as AddressFormData);
      break;

    case 'update':
      if (!addressId) return { error: 'Address ID is required for update action', status: 400 };
      if (!data) return { error: 'Address data is required for update action', status: 400 };

      addressResult = await updateAddress(addressId, userId, userPhone, data);
      break;

    case 'setDefault':
      if (!addressId) return { error: 'Address ID is required for setDefault action', status: 400 };

      await setDefaultAddress(addressId, userId);
      addressResult = { message: 'Default address updated successfully' };
      break;
  }

  return addressResult;
}

async function updateUserProfile(
  userId: string,
  userPhone: string,
  updateData: UpdateData
): Promise<ApiResponse<{ profile?: User | null; address?: any }>> {
  try {
    const validatedData: any = {};
    const allowedFields = ['name', 'phone', 'date_of_birth', 'profile_picture', 'bio', 'address'];

    for (const [key, value] of Object.entries(updateData)) {
      if (!allowedFields.includes(key))
        return err(`Field '${key}' is not allowed to be updated`, 400);

      switch (key) {
        case 'name':
          if (typeof value !== 'string' || value.trim().length === 0)
            return err('Name must be a non-empty string', 400);
          if (value.length > 255) return err('Name cannot exceed 255 characters', 400);
          validatedData[key] = value.trim();
          break;

        case 'phone':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string' || value.length > 15)
              return err('Phone must be a string with maximum 15 characters', 400);
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value.trim() !== '' && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')))
              return err('Invalid phone number format', 400);
            validatedData[key] = value.trim() || null;
          } else {
            validatedData[key] = null;
          }
          break;

        case 'date_of_birth':
          if (value !== null && value !== undefined) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (typeof value !== 'string' || !dateRegex.test(value))
              return err('Date of birth must be in YYYY-MM-DD format', 400);
            const date = new Date(value);
            if (isNaN(date.getTime())) return err('Invalid date of birth', 400);
            if (date > new Date()) return err('Date of birth cannot be in the future', 400);
            validatedData[key] = value;
          } else {
            validatedData[key] = null;
          }
          break;

        case 'profile_picture':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string')
              return err('Profile picture must be a string (URL)', 400);
            try {
              new URL(value);
              validatedData[key] = value;
            } catch {
              return err('Profile picture must be a valid URL', 400);
            }
          } else {
            validatedData[key] = null;
          }
          break;

        case 'bio':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string') return err('Bio must be a string', 400);
            if (value.length > 1000) return err('Bio cannot exceed 1000 characters', 400);
            validatedData[key] = value.trim() || null;
          } else {
            validatedData[key] = null;
          }
          break;

        case 'address':
          // Address will be handled separate
          break;
      }
    }

    let addressResult = null;
    if (updateData.address)
      addressResult = await handleAddressOperation(userId, userPhone, updateData.address);
    if (addressResult && addressResult.error) return err(addressResult.error, addressResult.status);

    // Only update user profile if there are validated fields to update
    let updatedProfile = null;
    if (Object.keys(validatedData).length > 0) {
      // Add updated_at timestamp
      const dataToUpdate = {
        ...validatedData,
        updated_at: new Date().toISOString()
      };

      const supabase = createClient();

      const { data: profile, error } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', userId)
        .select(
          `
          id, name, phone,
          date_of_birth, profile_picture, bio,
          role, status, is_active, address,
          created_at, updated_at, last_login, signup_date
        `
        )
        .single();

      if (error) return err('Failed to update profile', 500);
      updatedProfile = profile;
    }

    return ok({ profile: updatedProfile, address: addressResult }, 200);
  } catch (error) {
    return err('Failed to update profile', 500);
  }
}

export default updateUserProfile;
