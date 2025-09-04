'use client';

import { Input } from 'ui/input';
import { Button } from 'ui/button';
import { Textarea } from 'ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressFormData } from 'types/address';
import { addressSchema } from 'lib/validators/address';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { useAddressContext } from 'contexts/user/AddressContext';
import { useOtp } from 'hooks/user/shared/useOtp';
import OtpModal from '../shared/OtpModal';

const AddressForm = () => {
  const { addAddress, setShowAddForm } = useAddressContext();
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Home',
      full_name: '',
      phone: '',
      phone_secondary: '',
      email: '',
      postal_code: '',
      landmark: '',
      street: '',
      city: '',
      district: '',
      state: '',
      country: 'IN',
      type: 'shipping'
    }
  });

  // OTP modal state and hook
  const {
    otpModalOpen,
    setOtpModalOpen,
    verifyingPhone,
    onVerifyClick,
    verifyOtp,
    loading: otpLoading,
    error: otpError,
    cooldown,
    reset: resetOtp
  } = useOtp();

  const handleSubmit = (data: AddressFormData) => {
    const res = addAddress(data);
    if (res) form.reset();
  };

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader>
        <CardTitle>Add New Address</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      <Input
                        type="text"
                        inputMode="text"
                        placeholder="Enter full name"
                        {...field}
                      />
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
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={otpLoading || !field.value || field.value.length < 10}
                        onClick={() => onVerifyClick(field.value)}
                      >
                        Verify
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter secondary phone"
                        {...field}
                      />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter postal code" />
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
                    <FormLabel>Landmark</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter landmark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="House/Flat/Office No, Building Name, Street"
                      {...field}
                    />
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
                      <Input {...field} placeholder="Enter city" />
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
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter district" />
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
                      <Input {...field} placeholder="Enter state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter country" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">Save Address</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
        <OtpModal
          open={otpModalOpen}
          onOpenChange={open => {
            setOtpModalOpen(open);
            if (!open) resetOtp();
          }}
          phone={verifyingPhone}
          resendOtp={async () => {
            if (cooldown === 0) await onVerifyClick(verifyingPhone);
          }}
          resendDisabled={cooldown > 0}
          onChangeNumber={() => setOtpModalOpen(false)}
          onSubmit={async otp => {
            await verifyOtp(otp);
          }}
        />
        {otpError && <div className="text-destructive text-sm mt-2">{otpError}</div>}
      </CardContent>
    </Card>
  );
};

export default AddressForm;
