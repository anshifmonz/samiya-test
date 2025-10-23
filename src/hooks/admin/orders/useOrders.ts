'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from 'utils/apiRequest';
import { type Order } from 'types/admin/order';

export const useOrdersLogic = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>('pending');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  });
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.append('query', debouncedSearchQuery);
    if (statusFilter) params.append('status', statusFilter);
    if (dateRange.from) params.append('startDate', dateRange.from.toISOString());
    if (dateRange.to) params.append('endDate', dateRange.to.toISOString());
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    const { page = 1, pageSize = 20 } = pagination || {};
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const { data, error } = await apiRequest(`/api/admin/orders?${params.toString()}`);

    if (error) {
      setError(error);
    } else if (data && data.data) {
      setOrders(data.data.data);
      setPagination(data.data.meta);
      setError(null);
    }
    setLoading(false);
  }, [
    debouncedSearchQuery,
    statusFilter,
    dateRange,
    sortBy,
    sortOrder,
    pagination?.page,
    pagination?.pageSize
  ]);

  const refreshOrders = (): Promise<void> => fetchOrders();

  const approveOrder = async (orderId: string): Promise<void> => {
    const { error } = await apiRequest(`/api/admin/orders/${orderId}/approve`, {
      method: 'POST',
      body: { localOrderId: orderId },
      successMessage: 'Order approved successfully!',
      showSuccessToast: true,
      showErrorToast: true,
      errorMessage: 'Failed to approve order'
    });

    if (!error) refreshOrders();
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    const { error } = await apiRequest(`/api/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      body: { localOrderId: orderId },
      successMessage: 'Order cancelled successfully!',
      showSuccessToast: true,
      showErrorToast: true,
      errorMessage: 'Failed to cancel order'
    });

    if (!error) refreshOrders();
  };

  const updateStatus = async (orderId: string, status: string): Promise<{ error: any | null }> => {
    const { error } = await apiRequest(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
      showErrorToast: true,
      showSuccessToast: true,
      errorMessage: 'Failed to update order status',
      successMessage: 'Order status updated successfully!'
    });

    if (!error) refreshOrders();
    return { error };
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    error,
    sortBy,
    loading,
    dateRange,
    pagination,
    searchQuery,
    statusFilter,

    setSortBy,
    sortOrder,
    setSortOrder,
    setDateRange,
    setPagination,
    setSearchQuery,
    setStatusFilter,

    cancelOrder,
    approveOrder,
    updateStatus,
    refreshOrders
  };
};
