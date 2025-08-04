export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  phone_secondary?: string;
  email?: string;
  street: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  type: 'shipping' | 'billing';
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  label: string;
  full_name: string;
  phone: string;
  phone_secondary?: string;
  email?: string;
  street: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  postal_code: string;
  country: string;
  type?: 'shipping' | 'billing';
}

// Helper interface for frontend display (mapped from database fields)
export interface AddressDisplay {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  street: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'shipping' | 'billing';
  createdAt: string;
  updatedAt: string;
}
