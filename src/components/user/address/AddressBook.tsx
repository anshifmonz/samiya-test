'use client';

import { useState } from 'react';
import { Button } from 'ui/button';
import { MapPin, Plus } from 'lucide-react';
import { toast } from 'hooks/ui/use-toast';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import { AddressDisplay, AddressFormData } from 'types/address';
import { apiRequest } from 'utils/apiRequest';
import { mapAddressToDisplay } from 'utils/addressMapper';

interface AddressBookProps {
  initialAddresses: AddressDisplay[];
}

const AddressBook = ({ initialAddresses }: AddressBookProps) => {
  const [addresses, setAddresses] = useState<AddressDisplay[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);

  const onSubmit = async (data: AddressFormData) => {
    try {
      const { data: response, error } = await apiRequest('/api/user/profile/addresses', {
        method: 'POST',
        body: data,
        showErrorToast: false
      });

      if (error) {
        toast({
          title: "Error Adding Address",
          description: error
        });
        return;
      }

      if (response?.address) {
        const displayAddress = mapAddressToDisplay(response.address);
        setAddresses([...addresses, displayAddress]);
        setShowAddForm(false);
        toast({
          title: "Address Added",
          description: "Your new address has been saved successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error Adding Address",
        description: error?.message || "An error occurred."
      });
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      const { error } = await apiRequest(`/api/user/profile/addresses?id=${id}&action=set-default`, {
        method: 'PUT',
        showErrorToast: false
      });

      if (error) {
        toast({
          title: "Error Setting Default",
          description: error
        });
        return;
      }

      setAddresses(addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id
      })));

      toast({
        title: "Default Address Updated",
        description: "This address has been set as your default."
      });
    } catch (error: any) {
      toast({
        title: "Error Setting Default",
        description: error?.message || "An error occurred."
      });
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await apiRequest(`/api/user/profile/addresses?id=${id}`, {
        method: 'DELETE',
        showErrorToast: false
      });

      if (error) {
        toast({
          title: "Error Deleting Address",
          description: error
        });
        return;
      }

      const filteredAddresses = addresses.filter((addr) => addr.id !== id);

      if (addresses.find((addr) => addr.id === id)?.isDefault && filteredAddresses.length > 0)
        filteredAddresses[0].isDefault = true;

      setAddresses(filteredAddresses);

      toast({
        title: "Address Deleted",
        description: "The address has been removed from your address book."
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting Address",
        description: error?.message || "An error occurred."
      });
    }
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

          {showAddForm && (
            <AddressForm
              onSubmit={onSubmit}
              onCancel={() => setShowAddForm(false)}
            />
          )}

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
