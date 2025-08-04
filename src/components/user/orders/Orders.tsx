'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import OrderFilter from './OrderFilter';
import OrderList from './OrderList';
import OrderSummary from './OrderSummary';
import { Order } from 'types/order';

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      date: "2024-12-15",
      status: "delivered",
      total: 299.99,
      items: [
        { id: "1", name: "Wireless Headphones", price: 149.99, quantity: 1, image: "/placeholder.svg" },
        { id: "2", name: "Phone Case", price: 29.99, quantity: 2, image: "/placeholder.svg" },
        { id: "3", name: "USB Cable", price: 19.99, quantity: 3, image: "/placeholder.svg" }
      ],
      shippingAddress: "123 Main Street, New York, NY 12345"
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      date: "2024-11-28",
      status: "shipped",
      total: 89.99,
      items: [
        { id: "4", name: "Bluetooth Speaker", price: 89.99, quantity: 1, image: "/placeholder.svg" }
      ],
      shippingAddress: "456 Corporate Ave, Manhattan, NY 54321"
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      date: "2024-10-10",
      status: "processing",
      total: 159.99,
      items: [
        { id: "5", name: "Smart Watch", price: 159.99, quantity: 1, image: "/placeholder.svg" }
      ],
      shippingAddress: "123 Main Street, New York, NY 12345"
    },
    {
      id: "4",
      orderNumber: "ORD-2023-015",
      date: "2023-12-20",
      status: "delivered",
      total: 449.99,
      items: [
        { id: "6", name: "Laptop Stand", price: 79.99, quantity: 1, image: "/placeholder.svg" },
        { id: "7", name: "Wireless Mouse", price: 49.99, quantity: 1, image: "/placeholder.svg" },
        { id: "8", name: "Keyboard", price: 119.99, quantity: 1, image: "/placeholder.svg" }
      ],
      shippingAddress: "123 Main Street, New York, NY 12345"
    }
  ]);

  const filterOrders = (orders: Order[], filter: string) => {
    const now = new Date();
    const orderDate = (order: Order) => new Date(order.date);

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
