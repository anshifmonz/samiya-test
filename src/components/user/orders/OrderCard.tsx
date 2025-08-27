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
import { apiRequest } from 'utils/apiRequest';
import { DbEnumToMessage } from 'utils/shiprocket/dbEnumToMsg';

type ShipmentInfo = {
  status?: string | null;
  courier?: string | null;
  awb?: string | null;
  expected_delivery?: string | null;
  events?: any[];
  tracking_url?: string | null;
  error?: string | null;
};

interface OrderCardProps {
  order: OrderHistory & { shipment?: ShipmentInfo };
  onViewDetails?: (order: OrderHistory & { shipment?: ShipmentInfo }) => void;
}

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
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

  const isShowCancelButton = () => {
    const cancellableStatuses = ['pending', 'new', 'invoiced', 'ready_to_ship', 'pickup_scheduled'];
    return (
      cancellableStatuses.includes(order.status) &&
      order.status !== 'failed' &&
      order.status !== 'cancelled' &&
      order.payment_status !== 'failed'
    );
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    await apiRequest('/api/user/delivery/cancel-order', {
      method: 'POST',
      body: JSON.stringify({ localOrderId: orderId }),
      showErrorToast: true,
      showLoadingBar: true,
      errorMessage: `Failed to cancel order ${orderNumber}.`
    });
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
          <Button variant="outline" size="sm" onClick={() => onViewDetails?.(order)}>
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
          {isShowCancelButton() && (
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
