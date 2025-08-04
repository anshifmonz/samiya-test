'use client';

import { PaymentMethod } from 'types/payment';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { CreditCard, Star, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';

interface SavedPaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onSetDefault: (methodId: string) => void;
  onRemove: (methodId: string) => void;
}

const SavedPaymentMethods = ({ paymentMethods, onSetDefault, onRemove }: SavedPaymentMethodsProps) => {
  return (
    <Card className="bg-profile-card border-profile-border mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Saved Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No payment methods saved yet</p>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-profile-border rounded-lg">
              <div className="flex items-center gap-3">
                {method.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{method.name}</span>
                    {method.isDefault && <Badge>Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetDefault(method.id)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onRemove(method.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SavedPaymentMethods;
