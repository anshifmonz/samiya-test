'use client';

import { useEffect, useState } from 'react';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'ui/dialog';
import { Truck, ExternalLink, Calendar, CreditCard, MapPin, Package } from 'lucide-react';
import OrderItems from './OrderItems';
import { OrderHistory } from 'types/order';
import OrderStatusStepper from './OrderStatusStepper';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHistory | null;
}


export default function OrderDetailsDialog({ open, onOpenChange, order }: OrderDetailsDialogProps) {
  const [orderData, setOrderData] = useState<OrderHistory | null>(order);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      if (!open || !order?.id) return;
      try {
        const res = await fetch(`/api/user/order?orderId=${order.id}`);
        if (!res.ok) throw new Error('Failed to refresh order');
        const json = await res.json();
        if (!cancelled && json?.order) setOrderData(json.order as OrderHistory);
      } catch (_) {
        // ignore for now
      }
    }
    setOrderData(order || null);
    refresh();
    return () => { cancelled = true };
  }, [open, order?.id]);

  if (!orderData) return null;

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totals = {
    subtotal: order.items.reduce((s, it) => s + it.total_price, 0),
    total: order.total_amount,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order {order.order_number}</span>
            <Badge className="capitalize">{order.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <Card className="bg-profile-card border-profile-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Delivery Status</span>
                </div>
                {order.shiprocket_tracking_url && (
                  <Button asChild size="sm" variant="outline">
                    <a href={order.shiprocket_tracking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                      Track Shipment
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>
              <OrderStatusStepper status={order.status} />
              {order.shiprocket_awb_code && (
                <p className="mt-3 text-xs text-muted-foreground">AWB: {order.shiprocket_awb_code}</p>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="bg-profile-card border-profile-border">
            <CardContent className="p-4">
              <OrderItems items={order.items} />
            </CardContent>
          </Card>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-profile-card border-profile-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Order Date</span>
                </div>
                <div className="text-sm">{formatDateTime(order.created_at)}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment</span>
                </div>
                <div className="text-sm capitalize">
                  Method: {order.payment_method || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Status: {order.payment_status}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Package className="w-4 h-4" />
                  <span>Amounts</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="text-sm flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{totals.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-profile-card border-profile-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {order.shipping_address ? (
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{order.shipping_address.full_name}</div>
                      <div>{order.shipping_address.street}</div>
                      {order.shipping_address.landmark && (
                        <div>{order.shipping_address.landmark}</div>
                      )}
                      <div>
                        {[order.shipping_address.city, order.shipping_address.district, order.shipping_address.state]
                          .filter(Boolean)
                          .join(", ")} {order.shipping_address.postal_code}
                      </div>
                      <div>{order.shipping_address.country}</div>
                      <div className="text-xs text-muted-foreground mt-1">Phone: {order.shipping_address.phone}</div>
                    </div>
                  ) : (
                    <span>No shipping address</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

