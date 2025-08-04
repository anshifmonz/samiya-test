'use client';

import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { MapPin, Home, Building, Star, Edit, Trash2 } from 'lucide-react';
import { Address } from 'types/address';

interface AddressListProps {
  addresses: Address[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

const AddressList = ({ addresses, onSetDefault, onDelete }: AddressListProps) => {
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
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address.id} className="bg-profile-card border-profile-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {address.label === "Home" ? (
                      <Home className="w-5 h-5 text-primary" />
                    ) : (
                      <Building className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{address.label}</h3>
                    {address.isDefault && (
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{address.fullName}</p>
                  <p>{address.street}</p>
                  <p>{address.landmark}</p>
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  <p>Phone: {address.phone}</p>
                  {address.secondaryPhone && <p>Alt Phone: {address.secondaryPhone}</p>}
                  {address.email && <p>Email: {address.email}</p>}
                </div>
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetDefault(address.id)}
                    className="gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Set Default
                  </Button>
                )}
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(address.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AddressList;
