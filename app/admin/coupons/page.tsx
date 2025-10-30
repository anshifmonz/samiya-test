import { getCoupons } from 'lib/api/admin/coupons/get';
import CouponsTab from 'components/admin/coupons/CouponsTab';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Coupons Management',
  description: 'Create, edit, and manage discount coupons and promotions.',
  noIndex: true
});

export default async function CouponsPage() {
  const { data: coupons } = await getCoupons();

  return <CouponsTab initialCoupons={coupons || []} />;
}
