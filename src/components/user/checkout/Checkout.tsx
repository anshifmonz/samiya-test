'use client';

import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';
import AddressFormModal from '../shared/AddressFormModal';
import OrderSummary from './OrderSummary';
import EmptyCheckout from './EmptyCheckout';
import PaymentMethod from './PaymentMethod';
import DeliveryMethod from './DeliveryMethod';
import PriceBreakdown from './PriceBreakdown';
import ShippingAddress from './ShippingAddress';
import PlaceOrderSection from './PlaceOrderSection';
import { useCheckoutContext, CheckoutProvider } from 'contexts/user/CheckoutContext';

const CheckoutContent = () => {
  const { checkoutData, showAddressModal, setShowAddressModal, handleAddressAdded } =
    useCheckoutContext();

  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0)
    return <EmptyCheckout />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.location.assign('/user/cart')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* main content */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddress />
            <PaymentMethod />
            <DeliveryMethod />
          </div>

          {/* order summary */}
          <div className="space-y-6">
            <OrderSummary checkoutItems={checkoutData.items} />
            <PriceBreakdown />
            <PlaceOrderSection />
          </div>
        </div>

        {/* address form modal */}
        <AddressFormModal
          open={showAddressModal}
          onOpenChange={setShowAddressModal}
          onSubmitAddress={handleAddressAdded}
        />
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
