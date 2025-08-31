'use client';

import { Label } from 'ui/label';
import { Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from 'ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { useCheckoutContext } from 'contexts/user/CheckoutContext';

const DeliveryMethod = () => {
  const { deliveryOptions, selectedDelivery, setSelectedDelivery, subtotal } = useCheckoutContext();
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Delivery Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
          {deliveryOptions.map(option => (
            <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value={option.id} id={`delivery-${option.id}`} />
              <div className="flex-1">
                <Label htmlFor={`delivery-${option.id}`} className="cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-muted-foreground">{option.estimatedDays}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                    <div className="text-right">
                      {option.id === 'standard' && subtotal > 1000 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        <span className="font-medium">₹{option.price}</span>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default DeliveryMethod;
