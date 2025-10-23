'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { OrderHistory } from 'types/order';
import { apiRequest } from 'utils/apiRequest';
import { mapStatusIdToCategory } from 'lib/utils/shiprocket/tracking/mapStatusIdToCategory';

// From OrderStatusStepper
export type DeliveryStatus =
  | 'pending'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'return_initiated'
  | 'returned'
  | 'cancelled';

const normalizeStatus = (status?: string | null): DeliveryStatus | null => {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === 'pending') return 'pending';
  if (s === 'processing') return 'processing';
  if (s === 'packed') return 'packed';
  if (s === 'shipped' || s === 'in_transit') return 'shipped';
  if (s === 'out_for_delivery' || s === 'out for delivery')
    return 'out_for_delivery' as DeliveryStatus;
  if (s === 'delivered') return 'delivered';
  if (s === 'returned' || s === 'rto_delivered') return 'returned';
  if (s === 'return_initiated' || s === 'rto_initiated') return 'return_initiated';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  return s as DeliveryStatus;
};

const getStepIndex = (status: DeliveryStatus | null): number => {
  if (!status) return 0;
  switch (status) {
    case 'pending':
    case 'processing':
      return 0;
    case 'packed':
      return 1;
    case 'shipped':
      return 2;
    case 'out_for_delivery':
      return 3;
    case 'delivered':
      return 4;
    case 'return_initiated':
    case 'returned':
    case 'cancelled':
      return 4;
    default:
      return 0;
  }
};

export interface ShipmentInfo {
  origin?: string | null;
  destination?: string | null;
  status?: string | null;
  courier?: string | null;
  awb?: string | null;
  expected_delivery?: string | null;
  pickup_date?: string | null;
  delivered_date?: string | null;
  timeline?: Array<{
    date: string;
    activity: string;
    location?: string;
  }>;
  tracking_url?: string | null;
  error?: string | null;
}

export const useOrder = (initialOrders: OrderHistory[]) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<
    (OrderHistory & { shipment?: ShipmentInfo }) | null
  >(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [shipmentInfo, setShipmentInfo] = useState<ShipmentInfo | null>(null);
  const [isFetcingshipmentInfo, setIsFetcingshipmentInfo] = useState<boolean>(false);

  const filterOrders = (orders: OrderHistory[], filter: string) => {
    const now = new Date();
    const orderDate = (order: OrderHistory) => new Date(order.created_at);

    switch (filter) {
      case 'last30days':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orders.filter(order => orderDate(order) >= thirtyDaysAgo);
      case 'past3months':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return orders.filter(order => orderDate(order) >= threeMonthsAgo);
      case '2025':
        return orders.filter(order => orderDate(order).getFullYear() === 2025);
      case '2024':
        return orders.filter(order => orderDate(order).getFullYear() === 2024);
      case '2023':
        return orders.filter(order => orderDate(order).getFullYear() === 2023);
      default:
        return orders;
    }
  };

  const filteredOrders = useMemo(
    () => filterOrders(initialOrders, selectedFilter),
    [initialOrders, selectedFilter]
  );

  const handleCancelOrder = useCallback(async (orderId: string, orderNumber: string) => {
    await apiRequest('/api/user/delivery/cancel-order', {
      method: 'POST',
      body: JSON.stringify({ localOrderId: orderId }),
      showErrorToast: true,
      showLoadingBar: true,
      errorMessage: `Failed to cancel order ${orderNumber}.`
    });
  }, []);

  const isShowCancelButton = useCallback((order: OrderHistory) => {
    const cancellableStatuses = ['pending', 'new', 'invoiced', 'ready_to_ship', 'pickup_scheduled'];
    return (
      cancellableStatuses.includes(order.status) &&
      order.status !== 'failed' &&
      order.status !== 'cancelled' &&
      order.payment_status !== 'failed'
    );
  }, []);

  const fetchShipmentDetails = useCallback(async (order: OrderHistory) => {
    if (!order?.id) return;

    setIsFetcingshipmentInfo(true);
    const { data, error } = await apiRequest(`/api/user/delivery/track-order?id=${order.id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const tracking = data.data;
    if (error || !tracking) {
      setShipmentInfo({ error: 'Could not fetch tracking details.' });
      setIsFetcingshipmentInfo(false);
      return;
    }
    if (!Array.isArray(tracking.shipment_track) || tracking.shipment_track.length === 0) {
      setShipmentInfo({ error: 'No shipment tracking data available.' });
      setIsFetcingshipmentInfo(false);
      return;
    }
    const summary = tracking.shipment_track[0];
    const mappedStatus = mapStatusIdToCategory(Number(tracking.shipment_status));
    const shipment: ShipmentInfo = {
      origin: summary.origin,
      destination: summary.destination,
      status: mappedStatus,
      courier: summary.courier_name,
      expected_delivery: summary.edd || tracking.etd,
      pickup_date: summary.pickup_date,
      delivered_date: summary.delivered_date,
      timeline: Array.isArray(tracking.shipment_track_activities)
        ? tracking.shipment_track_activities.map((ev: any) => ({
            date: ev.date,
            activity: ev.activity,
            location: ev.location
          }))
        : []
    };
    setShipmentInfo(shipment);
    setIsFetcingshipmentInfo(false)
  }, []);

  const handleViewDetails = (order: OrderHistory) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Fetch shipment details when dialog opens and order is selected
  useEffect(() => {
    console.log('hit')
    if (detailsOpen && selectedOrder) {
      console.log('yes')
      fetchShipmentDetails(selectedOrder);
    } else {

      setShipmentInfo(null);
    }
  }, [detailsOpen, selectedOrder, fetchShipmentDetails]);

  const formatShippingAddress = (address: any) => {
    if (!address) return 'No shipping address';

    const parts = [
      address.full_name,
      address.street,
      address.landmark,
      address.city,
      address.district,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);

    return parts.join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'packaged':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.final_price, 0),
    [filteredOrders]
  );
  const deliveredOrders = useMemo(
    () => filteredOrders.filter(order => order.status === 'delivered').length,
    [filteredOrders]
  );

  return {
    // State
    selectedFilter,
    setSelectedFilter,
    filteredOrders,
    selectedOrder,
    detailsOpen,
    setDetailsOpen,
    isFetcingshipmentInfo,
    shipmentInfo,

    // Computed values
    totalSpent,
    deliveredOrders,

    // Handlers
    handleViewDetails,
    handleCancelOrder,
    isShowCancelButton,

    // Utils
    normalizeStatus,
    getStepIndex,
    formatShippingAddress,
    getStatusColor,
    formatDate
  };
};
