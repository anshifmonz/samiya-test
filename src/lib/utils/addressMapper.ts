import { Address, AddressDisplay, AddressFormData } from 'types/address';

export function mapAddressToDisplay(address: Address): AddressDisplay {
  return {
    id: address.id,
    label: address.label,
    fullName: address.full_name,
    phone: address.phone,
    secondaryPhone: address.phone_secondary,
    email: address.email,
    street: address.street,
    landmark: address.landmark,
    city: address.city,
    district: address.district,
    state: address.state,
    postalCode: address.postal_code,
    country: address.country,
    isDefault: address.is_default,
    type: address.type,
    createdAt: address.created_at,
    updatedAt: address.updated_at
  };
}

export function mapDisplayToFormData(address: AddressDisplay): AddressFormData {
  return {
    label: address.label,
    full_name: address.fullName,
    phone: address.phone,
    phone_secondary: address.secondaryPhone,
    email: address.email,
    street: address.street,
    landmark: address.landmark,
    city: address.city,
    district: address.district,
    state: address.state,
    postal_code: address.postalCode,
    country: address.country,
    type: address.type
  };
}

export function mapAddressesToDisplay(addresses: Address[]): AddressDisplay[] {
  return addresses.map(mapAddressToDisplay);
}
