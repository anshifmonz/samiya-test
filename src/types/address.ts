export interface Address {
  id: string;
  label: "Home" | "Work";
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  pincode: string;
  landmark: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface AddressFormData {
  label: "Home" | "Work";
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  pincode: string;
  landmark: string;
  street: string;
  city: string;
  state: string;
}
