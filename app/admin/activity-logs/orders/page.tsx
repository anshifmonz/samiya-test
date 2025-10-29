import type { Metadata } from 'next';
import OrdersDashboard from 'components/admin/activity-logs/orders/OrdersDashboard';

export const metadata: Metadata = {
  title: 'Order Activity Dashboard - Admin',
  description: 'View and manage order-related activity logs and statistics.',
  openGraph: {
    title: 'Order Activity Dashboard - Admin',
    description: 'View and manage order-related activity logs and statistics.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Order Activity Dashboard - Admin',
    description: 'View and manage order-related activity logs and statistics.',
    images: ['/opengraph-image.png']
  }
};

export default function Page() {
  return <OrdersDashboard />;
}
