'use client';

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Truck,
  ExternalLink
} from 'lucide-react';
import { OrderHistory } from 'types/order';
import OrderItems from './OrderItems';
import OrderStatusStepper from './OrderStatusStepper';
import { DbEnumToMessage } from 'utils/shiprocket/dbEnumToMsg';
import { useOrderContext } from 'contexts/user/OrderContext';
import { ShipmentInfo } from 'hooks/user/useOrder';

interface OrderCardProps {
  order: OrderHistory & { shipment?: ShipmentInfo };
}

const OrderCard = ({ order }: OrderCardProps) => {
  const {
    handleCancelOrder,
    isShowCancelButton,
    handleViewDetails,
    formatShippingAddress,
    getStatusColor,
    formatDate
  } = useOrderContext();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'processing':
        return <Package className="w-3 h-3" />;
      case 'packaged':
        return <Package className="w-3 h-3" />;
      case 'shipped':
        return <Package className="w-3 h-3" />;
      case 'delivered':
        return <CheckCircle className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.order_number}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="text-right space-y-2">
            <div className="flex flex-col gap-1">
              <Badge className={`${getStatusColor(order.status)} capitalize gap-1 hover:bg-`}>
                {getStatusIcon(order.status)}
                {DbEnumToMessage(order.status).title}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-foreground">
              ₹{order.total_amount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shipment Progress & Info */}
        {order.shipment ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>Delivery Status</span>
              </div>
              {order.shipment.tracking_url && (
                <Button asChild size="sm" variant="outline">
                  <a
                    href={order.shipment.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    Track Shipment
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
            <OrderStatusStepper status={order.shipment.status || order.status} />
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
              {order.shipment.courier && (
                <span>
                  Courier:{' '}
                  <span className="font-medium text-foreground">{order.shipment.courier}</span>
                </span>
              )}
              {order.shipment.awb && (
                <span>
                  AWB: <span className="font-mono">{order.shipment.awb}</span>
                </span>
              )}
              {order.shipment.expected_delivery && (
                <span>ETA: {order.shipment.expected_delivery}</span>
              )}
            </div>
            {order.shipment.error && (
              <div className="mt-2 text-xs text-destructive">{order.shipment.error}</div>
            )}
          </div>
        ) : null}

        {/* Order Items */}
        <OrderItems items={order.items} />

        {/* Shipping Address */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
            {formatShippingAddress(order.shipping_address)}
          </p>
        </div>

        {/* Order Actions */}
        <div className="flex gap-3 pt-4 border-t border-border flex-wrap">
          <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
            View Details
          </Button>
          {order.status === 'delivered' && (
            <Button variant="outline" size="sm">
              Reorder
            </Button>
          )}
          {order.payment_status === 'failed' && (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Retry Payment
            </Button>
          )}
          {isShowCancelButton(order) && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleCancelOrder(order.id, order.order_number)}
            >
              Cancel Order
            </Button>
          )}
          {/* Track Order button always available if tracking_url exists */}
          {order.shipment?.tracking_url && (
            <Button asChild variant="outline" size="sm">
              <a
                href={order.shipment.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                Track Order
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
