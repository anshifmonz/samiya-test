'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Coupon } from 'types/coupon';
import { apiRequest } from 'utils/apiRequest';
import {
  couponSchema,
  CouponFormValues,
  editCouponSchema,
  EditCouponFormValues
} from 'lib/validators/coupon';

interface CouponsTabContextType {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  expireCoupon: (id: number) => Promise<void>;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedCoupon: Coupon | null;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (coupon: Coupon) => void;
  closeEditDialog: () => void;
  addCouponForm: UseFormReturn<CouponFormValues>;
  onAddCouponSubmit: (values: CouponFormValues) => Promise<void>;
  editCouponForm: UseFormReturn<EditCouponFormValues>;
  onEditCouponSubmit: (values: EditCouponFormValues) => Promise<void>;
}

const CouponsTabContext = createContext<CouponsTabContextType | undefined>(undefined);

export const CouponsTabProvider: React.FC<{
  children: ReactNode;
  initialCoupons: Coupon[];
}> = ({ children, initialCoupons }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCouponForm = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      amount: 0,
      type: 'fixed',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      is_active: true
    }
  });

  const editCouponForm = useForm<EditCouponFormValues>({
    resolver: zodResolver(editCouponSchema)
  });

  useEffect(() => {
    if (selectedCoupon) {
      editCouponForm.reset({
        amount: selectedCoupon.amount,
        start_date: selectedCoupon.start_date,
        end_date: selectedCoupon.end_date
      });
    }
  }, [selectedCoupon, editCouponForm]);

  const openAddDialog = () => {
    addCouponForm.reset();
    setIsAddDialogOpen(true);
  };
  const closeAddDialog = () => setIsAddDialogOpen(false);

  const openEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedCoupon(null);
    setIsEditDialogOpen(false);
  };

  const onAddCouponSubmit = async (values: CouponFormValues) => {
    const { data, error } = await apiRequest<{ data: Coupon }>('/api/admin/coupons', {
      method: 'POST',
      body: values
    });
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => [...prev, data.data]);
      closeAddDialog();
    }
  };

  const onEditCouponSubmit = async (values: EditCouponFormValues) => {
    if (!selectedCoupon) return;
    const { data, error } = await apiRequest<{ data: Coupon }>(
      `/api/admin/coupons/${selectedCoupon.id}`,
      {
        method: 'PUT',
        body: values
      }
    );
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => prev.map(c => (c.id === selectedCoupon.id ? data.data : c)));
      closeEditDialog();
    }
  };

  const expireCoupon = async (id: number) => {
    const { data, error } = await apiRequest<{ data: Coupon }>(`/api/admin/coupons/${id}`, {
      method: 'PUT',
      body: { end_date: new Date().toISOString(), is_active: false }
    });
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => prev.map(c => (c.id === id ? data.data : c)));
    }
  };

  return (
    <CouponsTabContext.Provider
      value={{
        coupons,
        loading,
        error,
        expireCoupon,
        isAddDialogOpen,
        isEditDialogOpen,
        selectedCoupon,
        openAddDialog,
        closeAddDialog,
        openEditDialog,
        closeEditDialog,
        addCouponForm,
        onAddCouponSubmit,
        editCouponForm,
        onEditCouponSubmit
      }}
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
