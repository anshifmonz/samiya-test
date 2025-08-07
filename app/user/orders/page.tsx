import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserOrders } from 'lib/user/order/get';
import Orders from "components/user/orders/Orders";

export default async function OrderPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const orderResult = await getUserOrders(user.id, 1, 50);

  const orders = orderResult.success && orderResult.data
    ? orderResult.data.orders
    : [];

  return <Orders initialOrders={orders} />;
}
