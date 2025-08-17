import { supabaseAdmin } from 'lib/supabase';
import { User } from 'types/user';
import { AddressFormData } from 'types/address';
import { createAddress, updateAddress, setDefaultAddress } from './address';

interface UpdateData extends Partial<User> {
  address?: any;
}

export async function handleAddressOperation(userId: string, addressData: any) {
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

      addressResult = await createAddress(userId, data as AddressFormData);
      break;

    case 'update':
      if (!addressId) return { error: 'Address ID is required for update action', status: 400 };
      if (!data) return { error: 'Address data is required for update action', status: 400 };

      addressResult = await updateAddress(addressId, userId, data);
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
  updateData: UpdateData
): Promise<{ profile?: User | null; address?: any; error?: string; status?: number }> {
  try {
    const validatedData: any = {};
    const allowedFields = ['name', 'phone', 'date_of_birth', 'profile_picture', 'bio', 'address'];

    for (const [key, value] of Object.entries(updateData)) {
      if (!allowedFields.includes(key))
        return { error: `Field '${key}' is not allowed to be updated`, status: 400 };

      switch (key) {
        case 'name':
          if (typeof value !== 'string' || value.trim().length === 0)
            return { error: 'Name must be a non-empty string', status: 400 };
          if (value.length > 255)
            return { error: 'Name cannot exceed 255 characters', status: 400 };
          validatedData[key] = value.trim();
          break;

        case 'phone':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string' || value.length > 15)
              return { error: 'Phone must be a string with maximum 15 characters', status: 400 };
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value.trim() !== '' && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')))
              return { error: 'Invalid phone number format', status: 400 };
            validatedData[key] = value.trim() || null;
          } else {
            validatedData[key] = null;
          }
          break;

        case 'date_of_birth':
          if (value !== null && value !== undefined) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (typeof value !== 'string' || !dateRegex.test(value))
              return { error: 'Date of birth must be in YYYY-MM-DD format', status: 400 };
            const date = new Date(value);
            if (isNaN(date.getTime())) return { error: 'Invalid date of birth', status: 400 };
            if (date > new Date())
              return { error: 'Date of birth cannot be in the future', status: 400 };
            validatedData[key] = value;
          } else {
            validatedData[key] = null;
          }
          break;

        case 'profile_picture':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string')
              return { error: 'Profile picture must be a string (URL)', status: 400 };
            try {
              new URL(value);
              validatedData[key] = value;
            } catch {
              return { error: 'Profile picture must be a valid URL', status: 400 };
            }
          } else {
            validatedData[key] = null;
          }
          break;

        case 'bio':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string') return { error: 'Bio must be a string', status: 400 };
            if (value.length > 1000)
              return { error: 'Bio cannot exceed 1000 characters', status: 400 };
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
      addressResult = await handleAddressOperation(userId, updateData.address);
    if (addressResult && addressResult.error)
      return { error: addressResult.error, status: addressResult.status };

    // Only update user profile if there are validated fields to update
    let updatedProfile = null;
    if (Object.keys(validatedData).length > 0) {
      // Add updated_at timestamp
      const dataToUpdate = {
        ...validatedData,
        updated_at: new Date().toISOString()
      };

      const { data: profile, error } = await supabaseAdmin
        .from('users')
        .update(dataToUpdate)
        .eq('id', userId)
        .select(
          `
          id, name, email, phone,
          date_of_birth, profile_picture, bio,
          role, status, is_active, address,
          created_at, updated_at, last_login, signup_date
        `
        )
        .single();

      if (error) return { error: 'Failed to update profile', status: 500 };
      updatedProfile = profile;
    }

    return { profile: updatedProfile, address: addressResult, status: 200, error: null };
  } catch (error) {
    return { error: 'Failed to update profile', status: 500 };
  }
}

export default updateUserProfile;
