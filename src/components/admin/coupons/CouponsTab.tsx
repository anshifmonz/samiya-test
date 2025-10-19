'use client';

import type { Coupon } from 'types/coupon';
import CouponsTable from './CouponsTable';
import { Button } from 'components/ui/button';
import AddCouponDialog from './AddCouponDialog';
import EditCouponDialog from './EditCouponDialog';
import { CouponsTabProvider, useCouponsTab } from 'contexts/admin/coupons/CouponsContext';

const CouponsTabContent = () => {
  const { openAddDialog, selectedCoupon } = useCouponsTab();

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={openAddDialog}>Add Coupon</Button>
      </div>
      <CouponsTable />
      <AddCouponDialog />
      {selectedCoupon && <EditCouponDialog />}
    </div>
  );
};

interface CouponsTabProps {
  initialCoupons: Coupon[];
}

const CouponsTab: React.FC<CouponsTabProps> = ({ initialCoupons }) => {
  return (
    <CouponsTabProvider initialCoupons={initialCoupons}>
      <CouponsTabContent />
    </CouponsTabProvider>
  );
};

export default CouponsTab;
