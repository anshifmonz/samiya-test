import { Cashfree, CFEnvironment, CreateOrderRequest, OrderEntity, CustomerDetails, OrderMeta } from 'cashfree-pg';

// Cashfree configuration
export const cashfreeConfig = {
  clientId: process.env.CASHFREE_CLIENT_ID!,
  clientSecret: process.env.CASHFREE_CLIENT_SECRET!,
  environment: process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  apiVersion: '2025-01-01'
};

// Initialize Cashfree instance
let cashfreeInstance: Cashfree | null = null;

export const getCashfreeInstance = (): Cashfree => {
  if (!cashfreeInstance) {
    if (!cashfreeConfig.clientId || !cashfreeConfig.clientSecret) {
      throw new Error('Cashfree credentials not configured. Please set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET environment variables.');
    }

    cashfreeInstance = new Cashfree(
      cashfreeConfig.environment,
      cashfreeConfig.clientId,
      cashfreeConfig.clientSecret
    );
  }
  return cashfreeInstance;
};

// Extended types for our application
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

// Utility functions
export const generateOrderId = (prefix: string = 'order'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

export const createCashfreeOrder = async (
  orderData: CashfreeOrderRequest
): Promise<PaymentInitiationResult> => {
  try {
    const cashfree = getCashfreeInstance();

    const response = await cashfree.PGCreateOrder(orderData);

    if (response.data) {
      const isProduction = cashfreeConfig.environment === CFEnvironment.PRODUCTION;
      const baseUrl = isProduction ? 'api' : 'sandbox';

      return {
        success: true,
        data: {
          payment_session_id: response.data.payment_session_id || '',
          cf_order_id: response.data.cf_order_id || '',
          order_id: response.data.order_id || '',
          payment_url: `https://${baseUrl}.cashfree.com/pg/orders/${response.data.order_id}/payments`
        }
      };
    } else {
      return {
        success: false,
        error: 'Failed to create Cashfree order'
      };
    }
  } catch (error: any) {
    console.error('Cashfree order creation error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create payment session'
    };
  }
};

export interface CashfreeOrderFetchResult {
  success: boolean;
  error?: string;
  data?: OrderEntity;
}

export const fetchCashfreeOrder = async (orderId: string): Promise<CashfreeOrderFetchResult> => {
  try {
    const cashfree = getCashfreeInstance();
    const response = await cashfree.PGFetchOrder(orderId);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Cashfree order fetch error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch order'
    };
  }
};

export const verifyCashfreeWebhook = (
  signature: string,
  rawBody: string,
  timestamp: string
): boolean => {
  try {
    const cashfree = getCashfreeInstance();
    cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    return true;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return false;
  }
};

// Payment status mapping
export const mapCashfreeStatus = (cfStatus: string): string => {
  switch (cfStatus?.toUpperCase()) {
    case 'SUCCESS':
    case 'PAID':
      return 'completed';
    case 'FAILED':
    case 'CANCELLED':
      return 'failed';
    case 'PENDING':
    case 'ACTIVE':
      return 'pending';
    default:
      return 'pending';
  }
};

// Generate return URL for the application
export const generateReturnUrl = (orderId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/payment/return?order_id=${orderId}`;
};

// Generate webhook URL for payment notifications
export const generateWebhookUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/payment/webhook`;
};
