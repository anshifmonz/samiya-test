"use client";

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from 'types/order';
import OrderItems from './OrderItems';

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "processing":
        return <Package className="w-3 h-3" />;
      case "shipped":
        return <Package className="w-3 h-3" />;
      case "delivered":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.date)}
            </p>
          </div>
          <div className="text-right">
            <Badge className={`${getStatusColor(order.status)} capitalize gap-1`}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
            <p className="text-lg font-semibold text-foreground mt-1">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <OrderItems items={order.items} />

        {/* Shipping Address */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
            {order.shippingAddress}
          </p>
        </div>

        {/* Order Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          {order.status === "delivered" && (
            <Button variant="outline" size="sm">
              Reorder
            </Button>
          )}
          {(order.status === "pending" || order.status === "processing") && (
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              Cancel Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
