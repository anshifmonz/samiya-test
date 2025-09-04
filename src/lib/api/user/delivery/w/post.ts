import { supabaseAdmin } from 'lib/supabase';
import { mapStatusIdToAction } from 'utils/shiprocket/mapStatusIdToAction';
import { mapStatusIdDbEnum } from 'utils/shiprocket/mapStatusIdToDbEnum';
import { handleMappedAction3, handleMappedAction5 } from 'lib/services/shiprocketActions';

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
  const mappedActionInt = mapStatusIdToAction(statusId);

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
    local_status_id: Number(mappedActionInt), // Store raw ID for easier queries
    event_time,
    created_at: new Date()
  };
  const { error: deliveryError } = await supabaseAdmin
    .from('order_delivery_status')
    .insert(deliveryPayload);
  if (deliveryError) return 500;

  // 3. Update denormalized fields in orders (trigger will do this, but ensure fallback)
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('previous_statuses')
    .eq('id', order_id)
    .single();
  if (orderError) return 500;

  const updatePayload: any = {
    status: mapStatusIdDbEnum(statusId),
    latest_status_id: statusId,
    latest_status_text: status_text,
    latest_local_status_id: Number(mappedActionInt), // Store raw ID for easier queries
    previous_statuses: [...(orderData?.previous_statuses || []), Number(statusId)],
    last_event_at: event_time,
    updated_at: new Date()
  };
  await supabaseAdmin.from('orders').update(updatePayload).eq('id', order_id);

  // 4. Action logic
  if (mappedActionInt === 3) return await handleMappedAction3(order_id);
  if (mappedActionInt === 5) return await handleMappedAction5(order_id);

  return 200;
}
