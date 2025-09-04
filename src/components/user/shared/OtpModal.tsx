import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'ui/dialog';
import { Input } from 'ui/input';
import { Button } from 'ui/button';
import { Pencil } from 'lucide-react';

interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (otp: string) => Promise<void>;
  onChangeNumber: () => void;
  phone: string;
  resendOtp: () => void;
  resendDisabled: boolean;
}

const OtpModal = ({
  open,
  onOpenChange,
  onSubmit,
  onChangeNumber,
  phone,
  resendOtp,
  resendDisabled
}: OtpModalProps) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(otp);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Sent to {phone}</span>
            <Button type="button" variant="ghost" size="icon" onClick={onChangeNumber}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            required
            className="tracking-widest text-center text-lg"
          />
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={resendOtp} disabled={resendDisabled}>
              Resend OTP{resendDisabled ? ' (wait 1 min)' : ''}
            </Button>
            <Button type="submit" disabled={isSubmitting || otp.length !== 6}>
              Verify
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
