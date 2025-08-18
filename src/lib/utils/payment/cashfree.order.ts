import { getCashfreeInstance, cashfreeConfig } from './cashfree.config';
import { CFEnvironment } from 'cashfree-pg';
import {
  CashfreeOrderRequest,
  PaymentInitiationResult,
  CashfreeOrderFetchResult
} from './cashfree.types';

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

export const fetchCashfreeOrder = async (orderId: string): Promise<CashfreeOrderFetchResult> => {
  try {
    const cashfree = getCashfreeInstance();
    const { data } = await cashfree.PGFetchOrder(orderId);
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Cashfree order fetch error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch order'
    };
  }
};
