'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'ui/form';
import { Input } from 'ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { toast } from 'hooks/ui/use-toast';
import { AddressFormData, AddressDisplay } from 'types/address';
import { apiRequest } from 'utils/apiRequest';
import { mapAddressToDisplay } from 'utils/addressMapper';

interface AddressFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressAdded: (address: AddressDisplay) => void;
}

const AddressFormModal = ({ open, onOpenChange, onAddressAdded }: AddressFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormData>({
    defaultValues: {
      label: "Home",
      full_name: "",
      phone: "",
      phone_secondary: "",
      email: "",
      postal_code: "",
      landmark: "",
      street: "",
      city: "",
      district: "",
      state: "",
      country: "IN",
      type: "shipping"
    }
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await apiRequest('/api/user/profile/addresses', {
        method: 'POST',
        body: data,
        showErrorToast: false
      });

      if (error) {
        toast({
          title: "Error Adding Address",
          description: error,
          variant: "destructive"
        });
        return;
      }

      if (response?.address) {
        const displayAddress = mapAddressToDisplay(response.address);
        onAddressAdded(displayAddress);
        onOpenChange(false);
        form.reset();
        toast({
          title: "Address Added",
          description: "Your new address has been saved successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error Adding Address",
        description: error?.message || "An error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Label</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select address type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter alternate phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="House/Flat/Office No, Building Name, Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Near landmark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter district" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Adding..." : "Add Address"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormModal;