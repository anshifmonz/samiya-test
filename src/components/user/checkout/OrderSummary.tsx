'use client';

import { Badge } from 'ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { CheckoutItem } from 'types/checkout';

interface OrderSummaryProps {
  checkoutItems: CheckoutItem[];
}

const OrderSummary = ({ checkoutItems }: OrderSummaryProps) => {
  console.log('checkoutItems', checkoutItems);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checkoutItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.products?.primary_image_url || '/api/placeholder/80/80'}
              alt={item.product_title}
              className="w-16 h-16 object-cover rounded-lg bg-muted"
            />
            <div className="flex-1 space-y-1">
              <h4 className="font-medium text-sm">{item.product_title}</h4>
              <div className="flex gap-2 text-xs">
                {item.sizes?.name && (
                  <Badge variant="outline">{item.sizes.name}</Badge>
                )}
                {item.product_colors?.color_name && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.product_colors.color_name}  <span className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: item.product_colors.hex_code }}></span>
                    </Badge>
                    {/* <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.product_colors.hex_code }}></div> */}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                <div className="text-right">
                  <div className="font-medium">₹{item.product_price * item.quantity}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
