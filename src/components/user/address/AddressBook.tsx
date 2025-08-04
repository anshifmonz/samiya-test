'use client';

import { useState } from 'react';
import { Button } from 'ui/button';
import { MapPin, Plus } from 'lucide-react';
import { toast } from 'hooks/ui/use-toast';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import { Address, AddressFormData } from 'types/address';

const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      secondaryPhone: "+1 234 567 8901",
      email: "john@example.com",
      pincode: "12345",
      landmark: "Near Central Park",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      isDefault: true
    },
    {
      id: "2",
      label: "Work",
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      pincode: "54321",
      landmark: "Business District",
      street: "456 Corporate Ave",
      city: "Manhattan",
      state: "NY",
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const onSubmit = (data: AddressFormData) => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...data,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddress]);
    setShowAddForm(false);
    toast({
      title: "Address Added",
      description: "Your new address has been saved successfully."
    });
  };

  const setAsDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast({
      title: "Default Address Updated",
      description: "This address has been set as your default."
    });
  };

  const deleteAddress = (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    const filteredAddresses = addresses.filter(addr => addr.id !== id);

    if (addressToDelete?.isDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].isDefault = true;
    }

    setAddresses(filteredAddresses);
    toast({
      title: "Address Deleted",
      description: "The address has been removed from your address book."
    });
  };

  return (
    <div className="min-h-screen bg-profile-bg pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Address Book</h1>
                <p className="text-muted-foreground">Manage your shipping addresses</p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Address
            </Button>
          </div>

          {/* Add Address Form */}
          {showAddForm && (
            <AddressForm
              onSubmit={onSubmit}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Address List */}
          <AddressList
            addresses={addresses}
            onSetDefault={setAsDefault}
            onDelete={deleteAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
