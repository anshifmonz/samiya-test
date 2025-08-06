export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  details: string;
  isDefault: boolean;
}

export interface PaymentFormData {
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  upiId?: string;
  bankName?: string;
  walletProvider?: string;
}
