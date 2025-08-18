'use client';

import { useState } from 'react';
import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'hooks/ui/use-toast';
import { useRouter } from 'next/navigation';
import { apiRequest } from 'lib/utils/apiRequest';
import OrderSummary from './OrderSummary';
import EmptyCheckout from './EmptyCheckout';
import PaymentMethod from './PaymentMethod';
import DeliveryMethod from './DeliveryMethod';
import PriceBreakdown from './PriceBreakdown';
import ShippingAddress from './ShippingAddress';
import PlaceOrderSection from './PlaceOrderSection';
import AddressFormModal from '../address/AddressFormModal';
import { CheckoutData } from 'types/checkout';
import { DeliveryOption } from 'types/delivery';
import { Address, AddressDisplay } from 'types/address';
import { PaymentMethod as PaymentMethodType } from 'types/payment';
import { mapAddressToDisplay } from 'utils/addressMapper';
import { useCashfreeCheckout } from 'hooks/useCashfreeCheckout';

interface CheckoutProps {
  checkoutData?: CheckoutData;
  addresses: Address[];
}

const mockPaymentMethods: PaymentMethodType[] = [
  {
    id: '1',
    type: 'card',
    name: 'Credit Card',
    details: '**** **** **** 1234',
    isDefault: true
  },
  {
    id: '2',
    type: 'upi',
    name: 'UPI',
    details: 'john@paytm',
    isDefault: false
  },
  {
    id: '3',
    type: 'cod',
    name: 'Cash on Delivery',
    details: 'Pay when you receive',
    isDefault: false
  }
];

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    price: 99,
    estimatedDays: '5-7 business days',
    description: 'Free delivery on orders above ₹1000'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    price: 199,
    estimatedDays: '2-3 business days',
    description: 'Faster delivery to your doorstep'
  },
  {
    id: 'same-day',
    name: 'Same Day Delivery',
    price: 299,
    estimatedDays: 'Today by 9 PM',
    description: 'Available for select locations'
  }
];

const Checkout = ({ checkoutData, addresses: initialAddresses }: CheckoutProps) => {
  const router = useRouter();
  const { startCheckout, isLoading } = useCashfreeCheckout();

  // Convert Address[] to AddressDisplay[] for consistency
  const [addresses, setAddresses] = useState<AddressDisplay[]>(
    initialAddresses.map(mapAddressToDisplay)
  );
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses.find(addr => addr.isDefault)?.id || addresses[0]?.id || ''
  );
  const [selectedPayment, setSelectedPayment] = useState<string>(
    mockPaymentMethods.find(method => method.isDefault)?.id || mockPaymentMethods[0]?.id || ''
  );
  const [selectedDelivery, setSelectedDelivery] = useState<string>('standard');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
    return <EmptyCheckout />;
  }

  const subtotal = checkoutData.total;
  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);
  const deliveryCharges =
    subtotal > 1000 && selectedDelivery === 'standard' ? 0 : selectedDeliveryOption?.price || 0;
  const totalAmount = subtotal + deliveryCharges;

  const handleAddressAdded = (newAddress: AddressDisplay) => {
    setAddresses(prev => [...prev, newAddress]);
    if (addresses.length === 0 || newAddress.isDefault) setSelectedAddress(newAddress.id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: 'Address Required',
        description: 'Please select a shipping address.',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedPayment) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method.',
        variant: 'destructive'
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Accept Terms',
        description: 'Please accept the terms and conditions.',
        variant: 'destructive'
      });
      return;
    }

    if (!checkoutData?.checkout?.id) {
      toast({
        title: 'Checkout Error',
        description: 'Invalid checkout session. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const selectedPaymentMethod = mockPaymentMethods.find(
        method => method.id === selectedPayment
      );

      // Create the order first
      const { data, error } = await apiRequest('/api/user/order', {
        method: 'POST',
        body: {
          checkoutId: checkoutData.checkout.id,
          shippingAddressId: selectedAddress,
          paymentMethod: selectedPaymentMethod?.type || 'card'
        },
        showLoadingBar: true,
        showErrorToast: false
      });

      if (error) {
        toast({
          title: 'Order Failed',
          description: error,
          variant: 'destructive'
        });
        return;
      }

      // If payment is not required (COD), redirect to orders
      if (!data?.data?.payment_required) {
        toast({
          title: 'Order Placed Successfully!',
          description: `Your order has been created. You will receive a confirmation email shortly.`
        });
        router.push('/user/orders');
        return;
      }

      // For online payments, use payment details bundled in response
      const orderId = data.data.orderId;
      const payment = data.data.payment;
      if (!orderId || !payment || !payment.payment_session_id) {
        toast({
          title: 'Payment Initiation Failed',
          description:
            data?.data?.payment_error ||
            'Order was created but payment initiation failed. Please contact support.',
          variant: 'destructive'
        });
        return;
      }

      const { success } = await startCheckout(payment.payment_session_id, '_self');
      if (!success) {
        toast({
          title: 'Payment Failed',
          description: 'Payment failed. Please try again.',
          variant: 'destructive'
        });
        return;
      }
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'There was an unexpected error placing your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/user/cart')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* main content */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddress
              addresses={addresses}
              selectedAddress={selectedAddress}
              onAddressChange={setSelectedAddress}
              onAddNewAddress={() => setShowAddressModal(true)}
            />

            <PaymentMethod
              paymentMethods={mockPaymentMethods}
              selectedPayment={selectedPayment}
              onPaymentChange={setSelectedPayment}
            />

            <DeliveryMethod
              deliveryOptions={deliveryOptions}
              selectedDelivery={selectedDelivery}
              onDeliveryChange={setSelectedDelivery}
              subtotal={subtotal}
            />
          </div>

          {/* order summary */}
          <div className="space-y-6">
            <OrderSummary checkoutItems={checkoutData.items} />

            <PriceBreakdown
              checkoutItems={checkoutData.items}
              subtotal={subtotal}
              deliveryCharges={deliveryCharges}
              totalAmount={totalAmount}
            />

            <PlaceOrderSection
              acceptTerms={acceptTerms}
              onAcceptTermsChange={setAcceptTerms}
              isPlacingOrder={isPlacingOrder}
              totalAmount={totalAmount}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        {/* address form modal */}
        <AddressFormModal
          open={showAddressModal}
          onOpenChange={setShowAddressModal}
          onAddressAdded={handleAddressAdded}
        />
      </div>
    </div>
  );
};

export default Checkout;
