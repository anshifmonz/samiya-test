import retry from 'utils/retry';
import { supabaseAdmin } from 'lib/supabase';
import { cancelSROrder } from 'lib/shiprocket/orders';
import { createReturnForOrder } from 'lib/shiprocket/orders';
import { createRefund } from 'lib/api/user/payment/refund/create';
import { type SRReturnOrderPayload } from 'lib/shiprocket/types';

export async function handleMappedAction3(order_id: string) {
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('id, user_id, total_amount, shipping_address_id, created_at, payment_method')
    .eq('id', order_id)
    .single();
  if (orderError || !orderData) return 500;

  const { data: address, error: addressError } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('id', orderData.shipping_address_id)
    .single();
  if (addressError || !address) return 500;

  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('product_id, product_name, quantity, final_price')
    .eq('order_id', order_id);
  if (itemsError || !items) return 500;

  // Compose SRReturnOrderPayload
  const now = new Date();
  const order_date = orderData.created_at ? new Date(orderData.created_at) : now;
  const payload: SRReturnOrderPayload = {
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
    length: 10,
    breadth: 10,
    height: 10,
    weight: 1
  };

  await retry(() => createRefund(order_id, orderData.total_amount), 3, 1000);
  await retry(() => createReturnForOrder(order_id, payload), 3, 1000);
  return 200;
}

export async function handleMappedAction5(order_id: string) {
  const { data: payment, error: paymentError } = await supabaseAdmin
    .from('payments')
    .select('id, order_id, payment_amount, cf_order_id, status')
    .eq('order_id', order_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (paymentError) return 500;
  if (!payment) return 505;
  if (payment.status === 'refunded' || payment.status !== 'paid') return 200;

  await retry(
    () => createRefund(order_id, payment.payment_amount, 'Auto-refund: delivery canceled'),
    3,
    1000
  );
  await retry(() => cancelSROrder(order_id), 3, 1000);
  return 200;
}
