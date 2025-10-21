import { supabaseAdmin } from 'lib/supabase';
import { type OrderDetail } from 'types/admin/order';
import OrderDetails from 'components/admin/orders/[id]/OrderDetails';

async function getOrderDetails(orderId: string): Promise<OrderDetail | null> {
  const { data, error } = await supabaseAdmin.rpc('get_order_details', { p_order_id: orderId });
  if (error) return null;
  return data;
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderDetails(params.id);
  return <OrderDetails order={order} />;
}
