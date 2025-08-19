import { cancelSROrder } from './orders';
import { supabaseAdmin } from 'lib/supabase';
import { type CreateOrderParams } from './types';
import { getShiprocketToken } from './shiprocket';
import retry from 'utils/retry';
import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

async function SRCreateOrder(token: string, payload: any): Promise<any | false> {
  const { data, error, response } = await apiRequest(`${SR_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: payload,
    retry: true
  });
  if (error || (response && !response.ok)) return false;
  return data;
}

async function createSROrderForLocalOrder(localOrderId: string): Promise<ApiResponse<any>> {
  try {
    const token = await getShiprocketToken();
    if (!token) return err();

    // Fetch local order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, user_id, total_amount, shipping_address_id')
      .eq('id', localOrderId)
      .single();

    if (orderErr || !order) return err('Order not found', 404);

    // Fetch shipping address
    const { data: address } = await supabaseAdmin
      .from('addresses')
      .select(
        `
        name,
        phone,
        email,
        landmark,
        street,
        pincode,
        city,
        district,
        state,
        country
      `
      )
      .eq('id', order.shipping_address_id)
      .maybeSingle();

    if (!address) return err('Shipping address not found', 404);

    // Construct payload
    const payload: CreateOrderParams = {
      order_id: order.id,
      order_date: new Date().toISOString(),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',

      billing_customer_name: address.name || 'Customer',
      billing_city: address.city || '',
      billing_pincode: address.pincode || '',
      billing_state: address.state || '',
      billing_country: 'India',
      billing_email: address.email || '',
      billing_address: `${address.landmark}, ${address.street}, ${address.city}, ${address.district}, ${address.state}, ${address.country}`,
      billing_phone: address.phone || '',

      shipping_is_billing: true,
      shipping_customer_name: address.name || 'Customer',
      shipping_address: `${address.landmark}, ${address.street}, ${address.city}, ${address.district}, ${address.state}, ${address.country}`,
      shipping_city: address.city || '',
      shipping_pincode: address.pincode || '',
      shipping_country: 'India',
      shipping_state: address.state || '',
      shipping_email: address.email || '',
      shipping_phone: address.phone || '',

      order_items: [
        {
          name: `Order ${order.id}`,
          sku: `ORDER-${order.id}`,
          units: 1,
          selling_price: Number(order.total_amount)
        }
      ],

      payment_method: 'Prepaid',
      sub_total: Number(order.total_amount),

      length: 30,
      breadth: 5,
      height: 30,
      weight: 1
    };

    const sr = await SRCreateOrder(token, payload);
    if (!sr) return err('Failed to create order');

    // Update DB with Shiprocket info
    const update = {
      shiprocket_order_id: sr.order_id?.toString() || null,
      shiprocket_shipment_id: sr.shipment_id?.toString() || null,
      shiprocket_awb_code: (sr as any)?.awb_code || null,
      shiprocket_tracking_url: (sr as any)?.tracking_url || null
    };

    const { error } = await retry(async () => {
      return await supabaseAdmin
        .from('orders')
        .update(update)
        .eq('id', localOrderId);
    }, 5);
    if (!error) return ok(sr); // success

    const { error: cancelError } = await retry(async () => {
      return await cancelSROrder(localOrderId);
    }, 5);
    if (!cancelError) return err('Failed to create order');

    retry(async () => {
      return supabaseAdmin
        .from('cancel_order')
        .insert({ order_id: localOrderId })
    }, 5);
    return err('Failed to create order')
  } catch (error: any) {
    return err('Failed to create order');
  }
}

export { createSROrderForLocalOrder as SRCreateOrder };
