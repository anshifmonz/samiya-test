import { redirect } from 'next/navigation';
import Orders from 'components/user/orders/Orders';
import { getUserOrders } from 'lib/api/user/order/get';
import { getServerUser } from 'lib/auth/getServerUser';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'My Orders',
  description: 'View your order history and track the status of your purchases.',
  noIndex: true
});

export default async function OrderPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const orderResult = await getUserOrders(user.id, 1, 25);
  const orders = orderResult.success && orderResult.data ? orderResult.data.orders : [];

  return <Orders initialOrders={orders} />;
}
