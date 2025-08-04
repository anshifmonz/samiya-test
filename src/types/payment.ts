export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  details: string;
  isDefault: boolean;
  icon: React.ReactNode;
}

export interface WalletOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}
