import { err } from 'utils/api/response';
import { supabaseAdmin } from 'lib/supabase';
import { getShiprocketToken } from './shiprocket';
import { type SRReturnOrderPayload } from './types';
import {
  SRCancelOrder,
  SRCreateReturn,
  SRTrackByOrderId,
  SRGetOrderDetails,
  SRTrackByShipmentId,
  SRUpdateCustomerAddress,
  type SRAddressUpdatePayload
} from './order';

export async function updateDeliveryAddress(
  localOrderId: string,
  update: Omit<SRAddressUpdatePayload, 'order_id'>
) {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, shiprocket_order_id')
    .eq('id', localOrderId)
    .single();

  if (error) return err();
  if (!order?.shiprocket_order_id) return err('Order not found', 400);

  return SRUpdateCustomerAddress(token, { order_id: order.shiprocket_order_id, ...update });
}

export async function cancelSROrder(localOrderId: string) {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, shiprocket_order_id')
    .eq('id', localOrderId)
    .single();

  if (error) return err();
  if (!order?.shiprocket_order_id) return err('Order not found', 400);
  return SRCancelOrder(token, order.shiprocket_order_id);
}

export async function createReturnForOrder(localOrderId: string, payload: SRReturnOrderPayload) {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, shiprocket_order_id')
    .eq('id', localOrderId)
    .single();
  if (error) return err();
  if (!order?.shiprocket_order_id) return err('Order not found', 400);
  return SRCreateReturn({ ...payload, order_id: order.shiprocket_order_id });
}

export async function getTrackingByShipmentId(localOrderId: string) {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, shiprocket_shipment_id')
    .eq('id', localOrderId)
    .single();
  if (error) return err();
  if (!order?.shiprocket_shipment_id) return err('Order not found', 400);
  return SRTrackByShipmentId(token, order.shiprocket_shipment_id);
}

export async function getTrackingByOrderId(localOrderId: string) {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, shiprocket_order_id')
    .eq('id', localOrderId)
    .single();
  if (error) return err();
  if (!order?.shiprocket_order_id) return err('Order not found', 400);
  return SRTrackByOrderId(token, order.shiprocket_order_id);
}

export async function getSpecificOrderDetails(localOrderId: string) {
  const token = await getShiprocketToken();
  if (!token) return err();

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, shiprocket_order_id')
    .eq('id', localOrderId)
    .single();
  if (error) return err();
  if (!order?.shiprocket_order_id) return err('Order not found', 400);
  return SRGetOrderDetails(token, order.shiprocket_order_id);
}
