'use client';

import { ShoppingBag } from 'lucide-react';
import OrderList from './OrderList';
import OrderFilter from './OrderFilter';
import OrderSummary from './OrderSummary';
import OrderDetailsDialog from './OrderDetailsDialog';
import { OrderHistory } from 'types/order';
import { OrderProvider, useOrderContext } from 'contexts/OrderContext';

interface OrdersProps {
  initialOrders: OrderHistory[];
}

const OrdersContent = () => {
  const { filteredOrders } = useOrderContext();

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
          <OrderFilter />

          {/* Orders List */}
          <OrderList />

          {/* Order Summary */}
          {filteredOrders.length > 0 && <OrderSummary />}
        </div>
      </div>

      {/* Details Dialog */}
      <OrderDetailsDialog />
    </div>
  );
};

const Orders = ({ initialOrders }: OrdersProps) => {
  return (
    <OrderProvider initialOrders={initialOrders}>
      <OrdersContent />
    </OrderProvider>
  );
};

export default Orders;
