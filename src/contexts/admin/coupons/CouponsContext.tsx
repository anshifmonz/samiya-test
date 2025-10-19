'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCoupons } from 'hooks/admin/coupons/useCoupons';
import { Coupon } from 'types/coupon';

export type CouponsTabContextType = ReturnType<typeof useCoupons>;

const CouponsTabContext = createContext<CouponsTabContextType | undefined>(undefined);

export const CouponsTabProvider: React.FC<{
  children: ReactNode;
  initialCoupons: Coupon[];
}> = ({ children, initialCoupons }) => {
  const couponsData = useCoupons(initialCoupons);
  return <CouponsTabContext.Provider value={couponsData}>{children}</CouponsTabContext.Provider>;
};

export const useCouponsTab = () => {
  const context = useContext(CouponsTabContext);
  if (!context) throw new Error('useCouponsTab must be used within a CouponsTabProvider');
  return context;
};
