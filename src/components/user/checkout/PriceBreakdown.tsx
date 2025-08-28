'use client';

import { Separator } from 'ui/separator';
import { Card, CardContent } from 'ui/card';
import { useCheckoutContext } from 'contexts/user/CheckoutContext';

const PriceBreakdown = () => {
  const { checkoutData, subtotal, deliveryCharges, totalAmount } = useCheckoutContext();
  const checkoutItems = checkoutData?.items || [];
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex justify-between">
          <span>Subtotal ({checkoutItems.length} items)</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className={deliveryCharges === 0 ? 'text-green-600' : ''}>
            {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
