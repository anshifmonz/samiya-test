import { createContext, useContext, useState } from 'react';
import { Coupon } from 'types/coupon';
import { apiRequest } from 'utils/apiRequest';

interface CouponsTabContextType {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'created_at'>) => Promise<void>;
  editCoupon: (id: number, coupon: Partial<Coupon>) => Promise<void>;

  expireCoupon: (id: number) => Promise<void>;
}

const CouponsTabContext = createContext<CouponsTabContextType | undefined>(undefined);

export const CouponsTabProvider: React.FC<{
  children: React.ReactNode;
  initialCoupons: Coupon[];
}> = ({ children, initialCoupons }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'created_at'>) => {
    const { data, error } = await apiRequest<{ data: Coupon }>('/api/admin/coupons', {
      method: 'POST',
      body: coupon
    });
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => [...prev, data.data]);
    }
  };

  const editCoupon = async (id: number, coupon: Partial<Coupon>) => {
    const { data, error } = await apiRequest<{ data: Coupon }>(`/api/admin/coupons/${id}`, {
      method: 'PUT',
      body: coupon
    });
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => prev.map(c => (c.id === id ? data.data : c)));
    }
  };

  const expireCoupon = async (id: number) => {
    await editCoupon(id, { end_date: new Date().toISOString(), is_active: false });
  };

  return (
    <CouponsTabContext.Provider
      value={{ coupons, loading, error, addCoupon, editCoupon, expireCoupon }}
    >
      {children}
    </CouponsTabContext.Provider>
  );
};

export const useCouponsTab = () => {
  const context = useContext(CouponsTabContext);
  if (!context) throw new Error('useCouponsTab must be used within a CouponsTabProvider');
  return context;
};
