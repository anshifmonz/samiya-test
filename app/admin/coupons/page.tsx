import CouponsTab from 'components/admin/coupons/CouponsTab';
import { getCoupons } from 'lib/api/admin/coupons/get';

export default async function CouponsPage() {
  const { data: coupons } = await getCoupons();

  return <CouponsTab initialCoupons={coupons || []} />;
}
