import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import OrdersDashboard from 'components/admin/activity-logs/orders/OrdersDashboard';

export const metadata = generateBaseMetadata({
  title: 'Order Activity Dashboard',
  description: 'View and manage order-related activity logs and statistics.',
  noIndex: true
});

export default function Page() {
  return <OrdersDashboard />;
}
