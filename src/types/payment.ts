export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  details: string;
  isDefault: boolean;
  icon?: React.ReactNode;
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

export interface WalletOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Payment API request/response types
export type AllowedPaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface PaymentInitiationRequest {
  orderId: string;
  paymentMethod: AllowedPaymentMethod;
}

export interface PaymentInitiationResponse {
  success?: boolean;
  data?: {
    id: string;
    payment_session_id: string;
    cf_order_id: string;
    order_id: string;
    payment_url?: string;
  };
  error?: string;
}

export interface PaymentVerificationRequest {
  orderId?: string;
  cfOrderId?: string;
}

export interface PaymentVerificationResponse {
  success?: boolean;
  data?: {
    payment_status: string;
    order_status: string;
    payment_amount: number;
    cf_order_id: string;
    transaction_details?: any;
  };
  error?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    payment_status: string;
    order_status: string;
    payment_amount: number;
    order_amount: number;
    cf_order_id: string;
    created_at: string;
  };
  error?: string;
}

// Webhook types
export type CashfreeWebhookType =
  | 'PAYMENT_SUCCESS_WEBHOOK'
  | 'PAYMENT_FAILED_WEBHOOK'
  | 'PAYMENT_USER_DROPPED_WEBHOOK'
  | 'ORDER_PAID_WEBHOOK';

export interface CashfreeWebhookOrderData {
  order_id: string;
  cf_order_id: string;
  order_amount: number;
  order_status: string;
  payment_session_id: string;
  order_currency: string;
  order_tags?: Record<string, string>;
}

export interface CashfreeWebhookPaymentData {
  cf_payment_id: string;
  order_id: string;
  entity: string;
  payment_currency: string;
  payment_amount: number;
  payment_time: string;
  payment_completion_time: string;
  payment_status: string;
  payment_message: string;
  bank_reference: string;
  auth_id: string;
  payment_method: {
    [key: string]: any;
  };
  payment_group: string;
}

export interface CashfreeWebhookData {
  type: CashfreeWebhookType;
  data: {
    order?: CashfreeWebhookOrderData;
    payment?: CashfreeWebhookPaymentData;
  };
}

// Database payment record types
export interface PaymentRecord {
  id: string;
  order_id: string;
  method?: string;
  transaction_id?: string;
  status: string;
  cf_order_id?: string;
  cf_payment_id?: string;
  payment_session_id?: string;
  payment_amount?: number;
  payment_currency?: string;
  payment_gateway?: string;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}
