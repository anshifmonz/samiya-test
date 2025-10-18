import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'ui/input';
import { Button } from 'ui/button';
import { Calendar } from 'ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from 'ui/dialog';
import { format } from 'date-fns';
import { Coupon } from 'types/coupon';
import { useCouponsTab } from '@/contexts/admin/coupons/CouponsContext';
import { editCouponSchema, EditCouponFormValues } from 'lib/validators/coupon';

interface EditCouponDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon;
}

const EditCouponDialog: React.FC<EditCouponDialogProps> = ({ isOpen, onClose, coupon }) => {
  const { editCoupon } = useCouponsTab();
  const form = useForm<EditCouponFormValues>({
    resolver: zodResolver(editCouponSchema),
    defaultValues: {
      amount: coupon.amount,
      start_date: coupon.start_date,
      end_date: coupon.end_date
    }
  });

  const onSubmit = async (values: EditCouponFormValues) => {
    await editCoupon(coupon.id, values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Coupon Code</p>
              <p className="text-sm text-muted-foreground p-2 border rounded-md bg-gray-100">
                {coupon.code}
              </p>
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'}>
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={date => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'}>
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={date => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCouponDialog;
