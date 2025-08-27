'use client';

import { Card } from 'ui/card';
import { ShoppingBag } from 'lucide-react';
import OrderCard from './OrderCard';
import { useOrderContext } from 'contexts/user/OrderContext';

const OrderList = () => {
  const { filteredOrders, selectedFilter } = useOrderContext();

  if (filteredOrders.length === 0) {
    return (
      <Card className="bg-profile-card border-profile-border p-8 text-center">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
        <p className="text-muted-foreground">
          {selectedFilter === 'all'
            ? "You haven't placed any orders yet"
            : 'No orders found for the selected time period'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
