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
              src={item.image || '/api/placeholder/80/80'}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg bg-muted"
            />
            <div className="flex-1 space-y-1">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <div className="flex gap-2 text-xs">
                {item?.selectedSize && (
                  <Badge variant="outline">{item.selectedSize}</Badge>
                )}
                {item.selectedColor && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.selectedColor}  <span className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: item.colorHex }}></span>
                    </Badge>
                    {/* <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.product_colors.hex_code }}></div> */}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                <div className="text-right">
                  <div className="font-medium">₹{item.price * item.quantity}</div>
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
