import { CreateOrderRequest, OrderEntity, CustomerDetails, OrderMeta } from 'cashfree-pg';

export interface CashfreeOrderRequest extends CreateOrderRequest {
  order_id?: string;
  order_amount: number;
  order_currency: string;
  customer_details: CustomerDetails;
  order_meta?: OrderMeta;
  order_note?: string;
  order_expiry_time?: string;
}

export interface CashfreeOrderResponse extends OrderEntity {
  cf_order_id?: string;
  order_id?: string;
  order_status?: string;
  payment_session_id?: string;
  order_amount?: number;
  order_currency?: string;
  created_at?: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  error?: string;
  data?: {
    payment_session_id: string;
    cf_order_id: string;
    order_id: string;
    payment_url?: string;
  };
}

export interface CashfreeOrderFetchResult {
  success: boolean;
  error?: string;
  data?: OrderEntity;
}
