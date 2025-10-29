import type { Metadata } from 'next';
import { getCoupons } from 'lib/api/admin/coupons/get';
import CouponsTab from 'components/admin/coupons/CouponsTab';

export const metadata: Metadata = {
  title: 'Coupons Management - Admin',
  description: 'Create, edit, and manage discount coupons and promotions.',
  openGraph: {
    title: 'Coupons Management - Admin',
    description: 'Create, edit, and manage discount coupons and promotions.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Coupons Management - Admin',
    description: 'Create, edit, and manage discount coupons and promotions.',
    images: ['/opengraph-image.png']
  }
};

export default async function CouponsPage() {
  const { data: coupons } = await getCoupons();

  return <CouponsTab initialCoupons={coupons || []} />;
}
