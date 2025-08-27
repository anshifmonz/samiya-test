'use client';

import { Button } from 'ui/button';
import { Separator } from 'ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { useCartContext } from 'contexts/user/CartContext';

const CartSummary = () => {
  const {
    selectedItems,
    subtotal,
    totalDiscount,
    deliveryCharges,
    totalAmount,
    handleProceedToCheckout,
    handleContinueShopping
  } = useCartContext();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal ({selectedItems.length} items)</span>
            <span>₹{subtotal}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{totalDiscount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className={deliveryCharges === 0 ? 'text-green-600' : ''}>
              {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
            </span>
          </div>

          {subtotal > 0 && subtotal < 1000 && (
            <p className="text-xs text-muted-foreground">
              Add ₹{1000 - subtotal} more for free delivery
            </p>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button variant="outline" className="w-full" onClick={handleContinueShopping}>
          Continue Shopping
        </Button>
        <Button
          className="w-full"
          size="lg"
          disabled={selectedItems.length === 0}
          onClick={handleProceedToCheckout}
        >
          Proceed to Checkout ({selectedItems.length} items)
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
