'use client';

import OrderSummary from './OrderSummary';
import EmptyCheckout from './EmptyCheckout';
import PaymentMethod from './PaymentMethod';
import DeliveryMethod from './DeliveryMethod';
import PriceBreakdown from './PriceBreakdown';
import ShippingAddress from './ShippingAddress';
import PlaceOrderSection from './PlaceOrderSection';
import { useCheckoutContext, CheckoutProvider } from 'contexts/user/CheckoutContext';

const CheckoutContent = () => {
  const { checkoutData } = useCheckoutContext();

  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0)
    return <EmptyCheckout />;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* main content */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddress />
            {/* <DeliveryMethod /> */}
          </div>

          {/* order summary */}
          <div className="space-y-6">
            <OrderSummary />
            <PriceBreakdown />
            <PlaceOrderSection />
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = ({ checkoutData, addresses }) => {
  return (
    <CheckoutProvider checkoutData={checkoutData} addresses={addresses}>
      <CheckoutContent />
    </CheckoutProvider>
  );
};

export default Checkout;
