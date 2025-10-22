'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Coupon } from 'types/coupon';
import { apiRequest } from 'utils/apiRequest';
import {
  couponSchema,
  CouponFormValues,
  editCouponSchema,
  EditCouponFormValues
} from 'lib/validators/coupon';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCouponForm = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      amount: 0,
      type: 'fixed',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString()
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

  const openAddDialog = (): void => {
    addCouponForm.reset();
    setIsAddDialogOpen(true);
  };
  const closeAddDialog = (): void => setIsAddDialogOpen(false);

  const openEditDialog = (coupon: Coupon): void => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = (): void => {
    setSelectedCoupon(null);
    setIsEditDialogOpen(false);
  };

  const onAddCouponSubmit = async (values: CouponFormValues): Promise<void> => {
    const { data, error } = await apiRequest<{ data: Coupon }>('/api/admin/coupons', {
      method: 'POST',
      body: values,
      showErrorToast: true,
      showLoadingBar: true,
      showSuccessToast: true,
      errorMessage: 'Failed to add coupon',
      successMessage: 'Coupon added successfully'
    });
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => [...prev, data.data]);
      closeAddDialog();
    }
  };

  const onEditCouponSubmit = async (values: EditCouponFormValues): Promise<void> => {
    if (!selectedCoupon) return;
    const { data, error } = await apiRequest<{ data: Coupon }>(
      `/api/admin/coupons/${selectedCoupon.id}`,
      {
        method: 'PUT',
        body: values,
        showErrorToast: true,
        showLoadingBar: true,
        showSuccessToast: true,
        errorMessage: 'Failed to update coupon',
        successMessage: 'Coupon updated successfully'
      }
    );
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => prev.map(c => (c.id === selectedCoupon.id ? data.data : c)));
      closeEditDialog();
    }
  };

  const expireCoupon = async (id: number): Promise<void> => {
    const { data, error } = await apiRequest<{ data: Coupon }>(`/api/admin/coupons/${id}`, {
      method: 'PUT',
      body: { expired_at: new Date().toISOString() },
      showErrorToast: true,
      showLoadingBar: true,
      showSuccessToast: true,
      errorMessage: 'Failed to expire coupon',
      successMessage: 'Coupon expired successfully'
    });
    if (error) {
      setError(error);
    } else if (data) {
      setCoupons(prev => prev.map(c => (c.id === id ? data.data : c)));
    }
  };

  return {
    error,
    coupons,
    loading,
    selectedCoupon,
    isAddDialogOpen,
    isEditDialogOpen,

    openAddDialog,
    openEditDialog,
    closeAddDialog,
    closeEditDialog,

    expireCoupon,
    addCouponForm,
    editCouponForm,
    onAddCouponSubmit,
    onEditCouponSubmit
  };
};
