'use client';

import { Input } from 'ui/input';
import { Button } from 'ui/button';
import { Separator } from 'ui/separator';
import { Card, CardContent } from 'ui/card';
import { useCheckoutContext } from 'contexts/user/CheckoutContext';

const PriceBreakdown = () => {
  const {
    checkoutData,
    subtotal,
    deliveryCharges,
    totalAmount,
    couponCode,
    setCouponCode,
    couponMessage,
    discount,
    isApplyingCoupon,
    handleApplyCoupon
  } = useCheckoutContext();
  const checkoutItems = checkoutData?.items || [];

  return (
    <Card>
      <CardContent className="space-y-3 p-4 sm:p-6">
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

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              disabled={isApplyingCoupon}
            />
            <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </Button>
          </div>
          {couponMessage && (
            <span className={discount > 0 ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
              {couponMessage}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
