import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import OrdersTab from 'components/admin/orders/OrdersTab';

export const metadata = generateBaseMetadata({
  title: 'Orders Management',
  description: 'View and manage all customer orders.',
  noIndex: true
});

export default function OrdersPage() {
  return <OrdersTab />;
}
