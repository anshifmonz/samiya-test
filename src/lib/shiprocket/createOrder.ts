import { cancelSROrder } from './orders';
import { supabaseAdmin } from 'lib/supabase';
import { type CreateOrderParams } from './types';
import { getShiprocketToken } from './shiprocket';
import retry from 'utils/retry';
import { apiRequest } from 'utils/apiRequest';
import { ok, err, type ApiResponse } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

async function srApiCreateOrder(token: string, payload: any): Promise<any | false> {
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

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select(
        `id,
        user_id,
        total_amount,
        shipping_address_id,
        shiprocket_order_id,
        shiprocket_shipment_id,
        shiprocket_awb_code`
      )
      .eq('id', localOrderId)
      .single();

    if (orderErr || !order) return err('Order not found', 404);
    if (order.shiprocket_order_id)
      return ok({
        shiprocket_order_id: order.shiprocket_order_id,
        shiprocket_shipment_id: order.shiprocket_shipment_id,
        shiprocket_awb_code: order.shiprocket_awb_code
      });

    const { data: address } = await supabaseAdmin
      .from('addresses')
      .select(
        `name, phone, email,
        landmark, street, pincode,
        city, district, state, country`
      )
      .eq('id', order.shipping_address_id)
      .maybeSingle();

    if (!address) return err('Shipping address not found', 404);

    // Acquire creation lock via RPC
    const { data: lockRows, error: lockErr } = await retry(async () => {
      return await supabaseAdmin.rpc('ensure_shiprocket_creation_lock', {
        p_order_id: localOrderId,
        p_lock_ttl_seconds: 180
      });
    });

    if (lockErr) return err();
    if (!lockRows || !Array.isArray(lockRows) || lockRows.length === 0) return err();

    const lock = lockRows[0] as any;

    // If already exists, return existing IDs
    if (lock.action === 'exists') {
      return ok({
        shiprocket_order_id: lock.shiprocket_order_id,
        shiprocket_shipment_id: lock.shiprocket_shipment_id,
        shiprocket_awb_code: lock.shiprocket_awb_code
      });
    }

    // If creation is in progress elsewhere, return informative error
    if (lock.action === 'in_progress')
      return err('Order creation already in progress for this order', 409);

    // action === 'acquired' -> we are the creator
    if (lock.action !== 'acquired') return err();

    const creationToken: string | null = lock.creation_token || null;
    if (!creationToken) return err();

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

    const sr = await srApiCreateOrder(token, payload);
    if (!sr) {
      retry(async () => {
        return supabaseAdmin.rpc('mark_shiprocket_creation_failed', {
          p_order_id: localOrderId,
          p_creation_token: creationToken
        });
      });
      return err('Failed to create order');
    }

    const { error, data } = await retry(async () => {
      return await supabaseAdmin.rpc('save_shiprocket_creation_result', {
        p_order_id: localOrderId,
        p_creation_token: creationToken,
        p_shiprocket_order_id: sr.order_id?.toString() || null,
        p_shiprocket_shipment_id: sr.shipment_id?.toString() || null,
        p_shiprocket_awb_code: (sr as any)?.awb_code || null,
        p_webhook_payload: sr as any
      });
    }, 5);

    const saveResp = Array.isArray(data) && data[0] ? (data[0] as any) : null;
    if (!error && saveResp && (saveResp.success === true || saveResp.success === 'true'))
      return ok(sr); // success

    retry(async () => {
      return supabaseAdmin.rpc('mark_shiprocket_creation_failed', {
        p_order_id: localOrderId,
        p_creation_token: creationToken
      });
    });

    const { error: cancelError } = await retry(async () => {
      return await cancelSROrder(localOrderId);
    }, 5);
    if (!cancelError) return err('Failed to create order');

    retry(async () => {
      return supabaseAdmin
        .from('cancel_order')
        .insert({ order_id: localOrderId });
    }, 5);
    return err('Failed to create order');
  } catch (error: any) {
    return err('Failed to create order');
  }
}

export { createSROrderForLocalOrder as SRCreateOrder };
