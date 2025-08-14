'use client';

import React, { useState } from 'react';
import { Label } from 'ui/label';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { CreditCard, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from 'ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { PaymentMethod as PaymentMethodType } from 'types/payment';
import AddPaymentMethodDialog, { type AddPaymentMethodPayload } from './AddPaymentMethodDialog';

interface PaymentMethodProps {
  paymentMethods: PaymentMethodType[];
  selectedPayment: string;
  onPaymentChange: (paymentId: string) => void;
  onAddNewPaymentMethod?: (payload: AddPaymentMethodPayload) => void;
}

const PaymentMethod = ({ paymentMethods, selectedPayment, onPaymentChange, onAddNewPaymentMethod }: PaymentMethodProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedPayment} onValueChange={onPaymentChange}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
              <div className="flex-1">
                <Label htmlFor={`payment-${method.id}`} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{method.name}</span>
                    <span className="text-sm text-muted-foreground">{method.details}</span>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
        <Button variant="outline" className="w-full" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      </CardContent>

      <AddPaymentMethodDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdded={(payload) => {
          // Bubble up to parent to actually add and persist if desired
          onAddNewPaymentMethod?.(payload);
        }}
      />
    </Card>
  );
};

export default PaymentMethod;
