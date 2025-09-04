import { redirect } from 'next/navigation';
import Orders from 'components/user/orders/Orders';
import { getUserOrders } from 'lib/user/order/get';
import { getServerUser } from 'lib/auth/getServerUser';

export default async function OrderPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const orderResult = await getUserOrders(user.id, 1, 25);
  const orders = orderResult.success && orderResult.data ? orderResult.data.orders : [];

  return <Orders initialOrders={orders} />;
}
