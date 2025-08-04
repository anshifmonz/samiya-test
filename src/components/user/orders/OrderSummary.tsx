'use client';

import { Card, CardContent } from 'ui/card'
import { Order } from 'types/order';

interface OrderSummaryProps {
  orders: Order[];
}

const OrderSummary = ({ orders }: OrderSummaryProps) => {
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {deliveredOrders}
            </p>
            <p className="text-sm text-muted-foreground">Delivered Orders</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
