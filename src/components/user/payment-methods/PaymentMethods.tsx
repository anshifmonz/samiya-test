'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { toast } from 'hooks/ui/use-toast';
import SavedPaymentMethods from './SavedPaymentMethods';
import AddPaymentOptions from './AddPaymentOptions';
import { PaymentMethod } from 'types/payment';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa ending in 4242",
      details: "Expires 12/26",
      isDefault: true,
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: "2",
      type: "upi",
      name: "john.doe@paytm",
      details: "UPI ID",
      isDefault: false,
      icon: <CreditCard className="w-5 h-5" />
    }
  ]);

  const setAsDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been changed",
    });
  };

  const removePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    toast({
      title: "Payment method removed",
      description: "Payment method has been removed from your account",
    });
  };

  const addPaymentMethod = (newMethod: Omit<PaymentMethod, "id">) => {
    const method: PaymentMethod = {
      id: Date.now().toString(),
      ...newMethod,
      isDefault: paymentMethods.length === 0
    };
    setPaymentMethods(prev => [...prev, method]);
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully",
    });
  };

  return (
    <div className="min-h-screen bg-profile-bg pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">
            Manage your payment options for a seamless checkout experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Saved Payment Methods */}
          <SavedPaymentMethods
            paymentMethods={paymentMethods}
            onSetDefault={setAsDefault}
            onRemove={removePaymentMethod}
          />

          {/* Add Payment Method Options */}
          <AddPaymentOptions onAdd={addPaymentMethod} />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
