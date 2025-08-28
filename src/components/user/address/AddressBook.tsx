'use client';

import { Button } from 'ui/button';
import { MapPin, Plus } from 'lucide-react';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import { AddressDisplay } from 'types/address';
import { AddressProvider, useAddressContext } from 'contexts/user/AddressContext';

const AddressBookContent = () => {
  const { showAddForm, toggleAddForm } = useAddressContext();

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
            <Button onClick={toggleAddForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Address
            </Button>
          </div>

          {showAddForm && <AddressForm />}
          <AddressList />
        </div>
      </div>
    </div>
  );
};

interface AddressBookProps {
  initialAddresses: AddressDisplay[];
}

const AddressBook = ({ initialAddresses }: AddressBookProps) => {
  return (
    <AddressProvider initialAddresses={initialAddresses}>
      <AddressBookContent />
    </AddressProvider>
  );
};

export default AddressBook;
