import { getCashfreeInstance, cashfreeConfig } from './cashfree.config';
import { CFEnvironment, OrderEntity } from 'cashfree-pg';
import { CashfreeOrderRequest } from './cashfree.types';
import { ApiResponse, err, ok } from 'utils/api/response';

type CreateCashfreeOrderData = {
  payment_session_id: string;
  cf_order_id: string;
  order_id: string;
  payment_url: string;
};

export const createCashfreeOrder = async (
  orderData: CashfreeOrderRequest
): Promise<ApiResponse<CreateCashfreeOrderData>> => {
  try {
    const cashfree = getCashfreeInstance();
    const response = await cashfree.PGCreateOrder(orderData);
    if (!response.data) return err('Failed to create Cashfree order');

    const isProduction = cashfreeConfig.environment === CFEnvironment.PRODUCTION;
    const baseUrl = isProduction ? 'api' : 'sandbox';
    return ok({
      payment_session_id: response.data.payment_session_id || '',
      cf_order_id: response.data.cf_order_id || '',
      order_id: response.data.order_id || '',
      payment_url: `https://${baseUrl}.cashfree.com/pg/orders/${response.data.order_id}/payments`
    });
  } catch (_) {
    return err('Failed to create payment session');
  }
};

export const fetchCashfreeOrder = async (orderId: string): Promise<ApiResponse<OrderEntity>> => {
  try {
    const cashfree = getCashfreeInstance();
    const { data } = await cashfree.PGFetchOrder(orderId);
    return ok(data);
  } catch (_) {
    return err('Failed to fetch order');
  }
};
