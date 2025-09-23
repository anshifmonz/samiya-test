'use client';

import { useState, useEffect } from 'react';
import OtpModal from './OtpModal';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Button } from 'ui/button';
import { Switch } from 'ui/switch';
import { Textarea } from 'ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { useForm } from 'react-hook-form';
import { useOtp } from 'hooks/user/shared/useOtp';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from 'lib/validators/address';
import { AddressFormData, AddressDisplay } from 'types/address';

interface AddressFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitAddress: (formData: AddressFormData | AddressDisplay) => Promise<boolean> | boolean;
  initialValues?: Partial<AddressFormData | AddressDisplay>;
  isEdit?: boolean;
  showSaveToggle?: boolean;
}

const AddressFormModal = ({
  open,
  onOpenChange,
  onSubmitAddress,
  initialValues,
  isEdit = false,
  showSaveToggle = false
}: AddressFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(true);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: initialValues?.label || 'Home',
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
      country: 'India',
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

  useEffect(() => {
    if (!open) return;
    if (showSaveToggle) setSaveForFuture(true);

    form.reset({
      label: initialValues?.label || 'Home',
      full_name:
        'full_name' in (initialValues || {})
          ? (initialValues as any).full_name
          : (initialValues as any)?.fullName || '',
      phone: initialValues?.phone || '',
      phone_secondary:
        'phone_secondary' in (initialValues || {})
          ? (initialValues as any).phone_secondary
          : (initialValues as any)?.secondaryPhone || '',
      email: initialValues?.email || '',
      postal_code:
        'postal_code' in (initialValues || {})
          ? (initialValues as any).postal_code
          : (initialValues as any)?.postalCode || '',
      landmark: initialValues?.landmark || '',
      street: initialValues?.street || '',
      city: initialValues?.city || '',
      district: initialValues?.district || '',
      state: initialValues?.state || '',
      country: initialValues?.country || 'India',
      type: initialValues?.type || 'shipping'
    });
  }, [initialValues, open, showSaveToggle, form]);

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      const addressData =
        showSaveToggle && !isEdit ? { ...data, saveAddress: saveForFuture } : data;
      const res = await onSubmitAddress(addressData);
      if (res) form.reset();
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
      <DialogContent className="w-[90%] max-w-3xl max-h-[90vh] rounded-lg overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
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
                    <Textarea
                      placeholder="House/Flat/Office No, Building Name, Street"
                      {...field}
                    />
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
                    <FormLabel>District</FormLabel>
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
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showSaveToggle && (
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="save-for-future"
                  checked={saveForFuture}
                  onCheckedChange={setSaveForFuture}
                />
                <Label htmlFor="save-for-future">Want to save for future use?</Label>
              </div>
            )}

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
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isEdit && isSubmitting
                  ? 'Updating...'
                  : isSubmitting
                  ? 'Adding...'
                  : isEdit
                  ? 'Update Address'
                  : 'Add Address'}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormModal;
