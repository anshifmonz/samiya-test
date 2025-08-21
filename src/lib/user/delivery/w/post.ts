import { supabaseAdmin } from 'lib/supabase';
import { cancelSROrder } from 'lib/shiprocket/orders';
import { createReturnForOrder } from 'lib/shiprocket/orders';
import { createRefund } from 'lib/user/payment/refund/create';
import retry from 'utils/retry';
import { mapStatusIdToAction } from 'utils/shiprocket/mapStatusIdToAction';
import { mapShiprocketStatusId } from 'utils/shiprocket/mapStatusIdToDbEnum';
import { mapStatusIdToOpsAction } from 'utils/shiprocket/mapStatusIdToOpsAction';

/**
 * Process Shiprocket delivery webhook
 * @param rawBody - Raw JSON string from Shiprocket webhook
 * @returns HTTP status code
 */
export async function processShiprocketWebhook(rawBody: string): Promise<number> {
  let webhookData;
  try {
    webhookData = JSON.parse(rawBody);
  } catch (error) {
    return 400;
  }

  // Extract order_id and status
  const order_id = webhookData.order_id;
  const current_status_id = webhookData.current_status_id;
  const status_text = webhookData.current_status || webhookData.shipment_status;
  let event_time: Date;
  if (webhookData.current_timestamp) {
    // try ISO / epoch / Date.parse
    const parsed = Date.parse(webhookData.current_timestamp);
    event_time = Number.isFinite(parsed) ? new Date(parsed) : new Date();
  } else {
    event_time = new Date();
  }

  if (!order_id) return 400;

  // Map status and actions
  const statusId = current_status_id;
  const mappedStatus = mapShiprocketStatusId(statusId);
  const mappedActionInt = mapStatusIdToAction(statusId);
  const mappedOpsAction = mapStatusIdToOpsAction(statusId);
  // Map action int to enum
  const actionEnumMap: Record<number, string> = {
    1: 'normal',
    2: 'refund',
    3: 'retry',
    4: 'return',
    5: 'cancelled'
  };
  const mappedAction = actionEnumMap[mappedActionInt] || 'retry';

  // 1. Insert webhook event
  const webhookInsertPayload: any = {
    order_id,
    webhook_payload: webhookData,
    received_at: new Date()
  };
  const { data: eventInsert, error: eventError } = await supabaseAdmin
    .from('shiprocket_webhook_events')
    .insert(webhookInsertPayload)
    .select('id')
    .single();
  if (eventError) return 500;
  const webhook_event_id = eventInsert.id;

  // 2. Insert delivery status row
  const deliveryPayload: any = {
    order_id,
    webhook_event_id,
    status_id: statusId,
    status_text,
    mapped_status: mappedStatus,
    mapped_action: mappedAction,
    mapped_ops_action: mappedOpsAction,
    event_time,
    created_at: new Date()
  };
  const { error: deliveryError } = await supabaseAdmin
    .from('order_delivery_status')
    .insert(deliveryPayload);
  if (deliveryError) return 500;

  // 3. Update denormalized fields in orders (trigger will do this, but ensure fallback)
  const updatePayload: any = {
    latest_status_id: statusId,
    latest_status_text: status_text,
    latest_mapped_status: mappedStatus,
    latest_mapped_action: mappedAction,
    latest_ops_action: mappedOpsAction,
    last_event_at: event_time,
    updated_at: new Date()
  };
  await supabaseAdmin.from('orders').update(updatePayload).eq('id', order_id);

  // 4. Action logic (cancel, return, refund)
  if (mappedAction === 'cancelled') {
    // Cancel order in Shiprocket if not already cancelled
    if (order_id) {
      const token = process.env.SHIPROCKET_TOKEN;
      if (token) await cancelSROrder(order_id);
    }
  } else if (mappedAction === 'return') {
    // Fetch order, address, and items for return payload
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(
        'id, shiprocket_order_id, user_id, total_amount, shipping_address_id, created_at, payment_method'
      )
      .eq('id', order_id)
      .single();
    if (!orderError && orderData) {
      const { data: address, error: addressError } = orderData.shipping_address_id
        ? await supabaseAdmin
            .from('addresses')
            .select('*')
            .eq('id', orderData.shipping_address_id)
            .single()
        : { data: null, error: null };
      const { data: items, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('product_id, product_name, quantity, final_price')
        .eq('order_id', order_id);
      if (!itemsError && items && items.length > 0) {
        // Compose SRReturnOrderPayload
        const now = new Date();
        const order_date = orderData.created_at ? new Date(orderData.created_at) : now;
        const payload = {
          order_id: order_id,
          order_date: order_date.toISOString().slice(0, 16).replace('T', ' '),
          pickup_customer_name: address?.name || 'Customer',
          pickup_address: `${address.landmark}, ${address.street}, ${address.city}, ${address.district}, ${address.state}, ${address.country}`,
          pickup_city: address?.city || 'N/A',
          pickup_state: address?.state || 'N/A',
          pickup_country: address?.country || 'India',
          pickup_pincode: address?.pincode || 0,
          pickup_email: address?.email || 'support@example.com',
          pickup_phone: address?.phone || '0000000000',
          shipping_customer_name: address?.name || 'Customer',
          shipping_address: `${address.landmark}, ${address.street}, ${address.city}, ${address.district}, ${address.state}, ${address.country}`,
          shipping_city: address?.city || 'N/A',
          shipping_country: address?.country || 'India',
          shipping_pincode: address?.pincode || 0,
          shipping_state: address?.state || 'N/A',
          shipping_phone: address?.phone || '0000000000',
          order_items: items.map((item: any) => ({
            name: item.product_name,
            sku: item.product_id,
            units: item.quantity,
            selling_price: item.final_price
          })),
          payment_method: 'Prepaid',
          sub_total: orderData.total_amount,
          length: 10, // Placeholder, fetch from product if available
          breadth: 10,
          height: 10,
          weight: 1
        };
        await createReturnForOrder(order_id, payload);
      }
    }
  } else if (mappedAction === 'refund') {
    // Fetch payment info for refund
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('id, order_id, payment_amount, cf_order_id')
      .eq('order_id', order_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (!paymentError && payment) {
      // Use payment_amount for refund
      await createRefund(
        payment.cf_order_id,
        payment.payment_amount,
        'Auto-refund: delivery failure'
      );
    }
  }

  return 200;
}
