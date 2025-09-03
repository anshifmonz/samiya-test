'use client';

import { Label } from 'ui/label';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { MapPin, Plus, Edit3 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from 'ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { useCheckoutContext } from 'contexts/user/CheckoutContext';
import AddressFormModal from '../shared/AddressFormModal';

const ShippingAddress = () => {
  const {
    hasTemp,
    addresses,
    editingAddress,
    selectedAddress,
    isAddressModalOpen,

    setIsAddressModalOpen,
    setSelectedAddress,

    onAddAddress,
    onEditAddress,
    handleAddAddress,
    handleEditAddress
  } = useCheckoutContext();

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
            <Button onClick={onAddAddress} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            {addresses.map(address => (
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
                {address.id.includes('TEMP') && (
                  <Button variant="ghost" size="icon" onClick={() => onEditAddress(address)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>
          {!hasTemp && (
            <Button variant="outline" onClick={onAddAddress} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          )}
        </CardContent>
      </Card>
      {isAddressModalOpen && (
        <AddressFormModal
          open={isAddressModalOpen}
          onOpenChange={setIsAddressModalOpen}
          onSubmitAddress={editingAddress ? handleEditAddress : handleAddAddress}
          initialValues={editingAddress}
          isEdit={editingAddress && true}
          showSaveToggle={true}
        />
      )}
    </>
  );
};

export default ShippingAddress;
