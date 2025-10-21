'use client';

import type { Coupon } from 'types/coupon';
import { Plus } from 'lucide-react';
import CouponsTable from './CouponsTable';
import AddCouponDialog from './AddCouponDialog';
import EditCouponDialog from './EditCouponDialog';
import AdminTabHeaderButton from 'components/admin/shared/AdminTabHeaderButton';
import { CouponsTabProvider, useCouponsTab } from 'contexts/admin/coupons/CouponsContext';

const CouponsTabContent = () => {
  const { openAddDialog, selectedCoupon } = useCouponsTab();

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>
      <div className="flex justify-end mb-4">
        <AdminTabHeaderButton onClick={openAddDialog} label="Add Coupon">
          <Plus size={20} />
        </AdminTabHeaderButton>
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
