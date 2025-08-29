import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'hooks/ui/use-toast';
import { apiRequest } from 'lib/utils/apiRequest';
import { useCashfreeCheckout } from 'hooks/useCashfreeCheckout';
import { mapAddressToDisplay } from 'utils/addressMapper';
import { type CheckoutData } from 'types/checkout';
import { Address, AddressDisplay } from 'types/address';
import { PaymentMethod as PaymentMethodType } from 'types/payment';
import { DeliveryOption } from 'types/delivery';

export const mockPaymentMethods: PaymentMethodType[] = [
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

export const deliveryOptions: DeliveryOption[] = [
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

export function useCheckout({
  checkoutData,
  addresses: initialAddresses
}: {
  checkoutData?: CheckoutData;
  addresses: Address[];
}) {
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

  const subtotal = checkoutData?.total || 0;
  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);
  const deliveryCharges =
    subtotal > 1000 && selectedDelivery === 'standard' ? 0 : selectedDeliveryOption?.price || 0;
  const totalAmount = subtotal + deliveryCharges;

  const handleAddressAdded = (newAddress: AddressDisplay) => {
    setShowAddressModal(false);
    const finalAddress = { ...newAddress, id: 'TEMP_ID' };
    setAddresses(prev => [...prev, finalAddress]);
    if (addresses.length === 0 || newAddress.isDefault) setSelectedAddress(finalAddress.id);
    return true;
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
      const address = selectedAddress === 'TEMP_ID' && addresses.find(addr => addr.id === 'TEMP_ID');
      const { data, error } = await apiRequest('/api/user/order', {
        method: 'POST',
        body: {
          checkoutId: checkoutData.checkout.id,
          orderAddressId: selectedAddress,
          address,
          paymentMethod: selectedPaymentMethod?.type || 'card'
        },
        showLoadingBar: true,
        showErrorToast: true,
        errorMessage: 'Failed to create order. Please try again.'
      });
      if (error || data?.error) return;

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

  return {
    // State
    addresses,
    setAddresses,
    showAddressModal,
    setShowAddressModal,
    selectedAddress,
    setSelectedAddress,
    selectedPayment,
    setSelectedPayment,
    selectedDelivery,
    setSelectedDelivery,
    acceptTerms,
    setAcceptTerms,
    isPlacingOrder,
    setIsPlacingOrder,

    // Data
    checkoutData,
    mockPaymentMethods,
    deliveryOptions,

    // Computed
    subtotal,
    deliveryCharges,
    totalAmount,

    // Handlers
    handleAddressAdded,
    handlePlaceOrder
  };
}
