import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AdminOverview from 'components/admin/AdminOverview';
import AdminNavigation from 'components/admin/AdminNavigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Samiya Online',
  description: 'Overview and management of the Samiya Online e-commerce platform.',
  openGraph: {
    title: 'Admin Dashboard - Samiya Online',
    description: 'Overview and management of the Samiya Online e-commerce platform.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Admin Dashboard - Samiya Online',
    description: 'Overview and management of the Samiya Online e-commerce platform.',
    images: ['/opengraph-image.png']
  }
};

export default function AdminPage() {
  const headerList = headers();
  const username = headerList.get('x-admin-username');

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="space-y-8">
        <AdminOverview username={username} />
        <AdminNavigation />
      </div>
    </div>
  );
}
