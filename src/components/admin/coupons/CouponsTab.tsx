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
      <div className="mb-6">
        <h1 className="luxury-heading xs:text-2xl text-3xl sm:text-4xl text-luxury-black mb-2 sm:mb-4">
          Coupons & Discounts
        </h1>
        <p className="luxury-body text-luxury-gray xs:text-sm text-base sm:text-lg">
          Manage your coupons & discounts with ease
        </p>
      </div>
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
