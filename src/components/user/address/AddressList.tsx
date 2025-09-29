'use client';

import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { Info, MapPin, Home, Building, Star, Edit, Trash2 } from 'lucide-react';
import AddressFormModal from '../shared/AddressFormModal';
import { useAddressContext } from 'contexts/user/AddressContext';

const AddressList = () => {
  const {
    addresses,
    modalOpen,
    editAddress,
    setModalOpen,
    setAsDefault,
    deleteAddress,
    handleEditOpen,
    handleEditAddress
  } = useAddressContext();

  if (addresses.length === 0) {
    return (
      <Card className="bg-profile-card border-profile-border p-8 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No addresses found</h3>
        <p className="text-muted-foreground">Add your first address to get started</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {addresses.map(address => (
          <Card key={address.id} className="bg-profile-card border-profile-border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between flex-col">
                <div className="flex justify-between w-full mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {address.label === 'Home' ? (
                        <Home className="w-5 h-5 text-primary" />
                      ) : (
                        <Building className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground hidden sm:inline">
                        {address.label}
                      </h3>
                      {address.isDefault && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          Default
                        </div>
                      )}
                      {!address?.is_phone_verified && (
                        <div className="flex items-center gap-1 bg-destructive/10 text-destructive pr-2 py-1 rounded-full text-xs ml-2">
                          <Info className="h-4" />
                          Not Verified
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsDefault(address.id)}
                        className="gap-1"
                      >
                        <Star className="w-3 h-3" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleEditOpen(address)}
                    >
                      <Edit className="w-3 h-3" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAddress(address.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{address.fullName}</p>
                  <p>{address.street}</p>
                  <p>{address.landmark}</p>
                  <p>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p>Phone: {address.phone}</p>
                  {address.secondaryPhone && <p>Alt Phone: {address.secondaryPhone}</p>}
                  {address.email && <p>Email: {address.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddressFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmitAddress={handleEditAddress}
        initialValues={editAddress}
        isEdit={Boolean(editAddress)}
      />
    </>
  );
};

export default AddressList;
