'use client';

import { useState } from 'react';
import type { Coupon } from 'types/coupon';
import CouponsTable from './CouponsTable';
import { Button } from 'components/ui/button';
import AddCouponDialog from './AddCouponDialog';
import EditCouponDialog from './EditCouponDialog';
import { CouponsTabProvider } from 'contexts/admin/coupons/CouponsContext';

const CouponsTabContent = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const openEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedCoupon(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Coupon</Button>
      </div>
      <CouponsTable openEditDialog={openEditDialog} />
      <AddCouponDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
      {selectedCoupon && (
        <EditCouponDialog
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          coupon={selectedCoupon}
        />
      )}
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
