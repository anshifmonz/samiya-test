'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import OrderList from './OrderList';
import OrderFilter from './OrderFilter';
import OrderSummary from './OrderSummary';
import { OrderHistory } from 'types/order';

interface OrdersProps {
  initialOrders: OrderHistory[];
}

const Orders = ({ initialOrders }: OrdersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [orders] = useState<OrderHistory[]>(initialOrders);

  const filterOrders = (orders: OrderHistory[], filter: string) => {
    const now = new Date();
    const orderDate = (order: OrderHistory) => new Date(order.created_at);

    switch (filter) {
      case "last30days":
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orders.filter(order => orderDate(order) >= thirtyDaysAgo);
      case "past3months":
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return orders.filter(order => orderDate(order) >= threeMonthsAgo);
      case "2025":
        return orders.filter(order => orderDate(order).getFullYear() === 2025);
      case "2024":
        return orders.filter(order => orderDate(order).getFullYear() === 2024);
      case "2023":
        return orders.filter(order => orderDate(order).getFullYear() === 2023);
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrders(orders, selectedFilter);

  return (
    <div className="min-h-screen bg-profile-bg pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Order History</h1>
                <p className="text-muted-foreground">Track and manage your orders</p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <OrderFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {/* Orders List */}
          <OrderList
            orders={filteredOrders}
            selectedFilter={selectedFilter}
          />

          {/* Order Summary */}
          {filteredOrders.length > 0 && (
            <OrderSummary orders={filteredOrders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
