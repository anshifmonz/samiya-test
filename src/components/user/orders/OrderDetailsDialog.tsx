'use client';

import { Badge } from 'ui/badge';
import { Card, CardContent } from 'ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'ui/dialog';
import { Calendar, CreditCard, MapPin, Package } from 'lucide-react';
import OrderItems from './OrderItems';
import OrderStatusStepper from './OrderStatusStepper';
import { useOrderContext } from 'contexts/user/OrderContext';

export default function OrderDetailsDialog() {
  const { detailsOpen, setDetailsOpen, selectedOrder } = useOrderContext();

  if (!selectedOrder) return null;

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const totals = {
    subtotal: selectedOrder.items.reduce((s, it) => s + it.total_price, 0),
    total: selectedOrder.final_price
  };

  return (
    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order {selectedOrder.order_number}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress & Shipment Info */}
          <OrderStatusStepper />
          {/* Items */}
          <Card className="bg-profile-card border-profile-border">
            <CardContent className="p-4">
              <OrderItems items={selectedOrder.items} />
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
                <div className="text-sm">{formatDateTime(selectedOrder.created_at)}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment</span>
                </div>
                <div className="text-sm capitalize">
                  Method: {selectedOrder.payment_method || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: {selectedOrder.payment_status}
                </div>
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
                  {selectedOrder.shipping_address ? (
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {selectedOrder.shipping_address.full_name}
                      </div>
                      <div>{selectedOrder.shipping_address.street}</div>
                      {selectedOrder.shipping_address.landmark && (
                        <div>{selectedOrder.shipping_address.landmark}</div>
                      )}
                      <div>
                        {[
                          selectedOrder.shipping_address.city,
                          selectedOrder.shipping_address.district,
                          selectedOrder.shipping_address.state
                        ]
                          .filter(Boolean)
                          .join(', ')}{' '}
                        {selectedOrder.shipping_address.postal_code}
                      </div>
                      <div>{selectedOrder.shipping_address.country}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Phone: {selectedOrder.shipping_address.phone}
                      </div>
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
