'use client';

import { Label } from 'ui/label';
import { Button } from 'ui/button';
import { Checkbox } from 'ui/checkbox';
import { Card, CardContent } from 'ui/card';
import { ShieldCheck } from 'lucide-react';

import { useCheckoutContext } from 'contexts/user/CheckoutContext';

const PlaceOrderSection = () => {
  const { acceptTerms, setAcceptTerms, isPlacingOrder, totalAmount, handlePlaceOrder } =
    useCheckoutContext();
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={checked => setAcceptTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-primary underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handlePlaceOrder}
          disabled={!acceptTerms || isPlacingOrder}
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Placing Order...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Place Order - ₹{totalAmount}
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure and encrypted payment</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderSection;
