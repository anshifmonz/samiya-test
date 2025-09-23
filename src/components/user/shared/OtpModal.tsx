import { useState } from 'react';
import { Button } from 'ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'ui/input-otp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from 'ui/dialog';

interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (otp: string) => Promise<void>;
  onChangeNumber: () => void;
  phone: string;
  resendOtp: () => void;
  resendDisabled: boolean;
}

const OtpModal = ({ open, onOpenChange, onSubmit, resendOtp, resendDisabled }: OtpModalProps) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return;
    setIsSubmitting(true);
    await onSubmit(otp);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 sm:p-6 rounded-lg w-[90%] sm:w-[70%] max-w-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            Mobile Phone Verification
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            Enter the 4-digit verification code that was sent to your phone number.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          <div className="flex justify-center w-full">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2 sm:gap-3">
                <InputOTPSlot
                  className="h-12 w-12 sm:h-14 sm:w-14 text-base sm:text-lg"
                  index={0}
                />
                <InputOTPSlot
                  className="h-12 w-12 sm:h-14 sm:w-14 text-base sm:text-lg"
                  index={1}
                />
                <InputOTPSlot
                  className="h-12 w-12 sm:h-14 sm:w-14 text-base sm:text-lg"
                  index={2}
                />
                <InputOTPSlot
                  className="h-12 w-12 sm:h-14 sm:w-14 text-base sm:text-lg"
                  index={3}
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-[50%] text-white cursor-pointer"
            disabled={isSubmitting || otp.length !== 4}
          >
            Verify
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Didn’t receive code?{' '}
          <Button
            variant="link"
            className="p-0 h-auto text-blue-500 cursor-pointer hover:underline disabled:text-gray-400"
            onClick={resendOtp}
            disabled={resendDisabled}
          >
            Resend
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
