import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Orders from 'components/user/orders/Orders';
import { getUserOrders } from 'lib/api/user/order/get';
import { getServerUser } from 'lib/auth/getServerUser';

export const metadata: Metadata = {
  title: 'My Orders - Samiya Online',
  description: 'View your order history and track the status of your purchases.',
  openGraph: {
    title: 'My Orders - Samiya Online',
    description: 'View your order history and track the status of your purchases.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'My Orders - Samiya Online',
    description: 'View your order history and track the status of your purchases.',
    images: ['/opengraph-image.png']
  }
};

export default async function OrderPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const orderResult = await getUserOrders(user.id, 1, 25);
  const orders = orderResult.success && orderResult.data ? orderResult.data.orders : [];

  return <Orders initialOrders={orders} />;
}
