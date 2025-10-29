import type { Metadata } from 'next';
import OrdersTab from 'components/admin/orders/OrdersTab';

export const metadata: Metadata = {
  title: 'Orders Management - Admin',
  description: 'View and manage all customer orders.',
  openGraph: {
    title: 'Orders Management - Admin',
    description: 'View and manage all customer orders.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Orders Management - Admin',
    description: 'View and manage all customer orders.',
    images: ['/opengraph-image.png']
  }
};

export default function OrdersPage() {
  return <OrdersTab />;
}
