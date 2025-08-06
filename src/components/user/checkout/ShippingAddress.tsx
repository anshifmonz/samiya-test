'use client';

import { Label } from 'ui/label';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { MapPin, Plus, Edit3 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from 'ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { AddressDisplay } from 'types/address';

interface ShippingAddressProps {
  addresses: AddressDisplay[];
  selectedAddress: string;
  onAddressChange: (addressId: string) => void;
  onAddNewAddress: () => void;
}

const ShippingAddress = ({
  addresses,
  selectedAddress,
  onAddressChange,
  onAddNewAddress
}: ShippingAddressProps) => {
  if (!addresses || addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No saved addresses found</p>
            <Button onClick={onAddNewAddress} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedAddress} onValueChange={onAddressChange}>
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={`address-${address.id}`} className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{address.fullName}</span>
                    <Badge variant="outline">{address.label}</Badge>
                    {address.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.street}, {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                </Label>
              </div>
              <Button variant="ghost" size="icon">
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
        <Button variant="outline" onClick={onAddNewAddress} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShippingAddress;
