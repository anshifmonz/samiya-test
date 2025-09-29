'use client';

import { useState, useEffect } from 'react';
import { Button } from 'ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'ui/input-otp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from 'ui/dialog';
import { useOtpContext } from 'contexts/user/shared/OtpContext';

const OtpModal = () => {
  const {
    otpModalOpen,
    setOtpModalOpen,
    verifyOtp,
    resend,
    error,
    loading,
    remainingAttempts,
    resetAttemptsCountdownFormatted,
    cooldown,
    resetAttemptsCountdown
  } = useOtpContext();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!otpModalOpen) setOtp('');
  }, [otpModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsSubmitting(true);
    await verifyOtp(otp);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={otpModalOpen} onOpenChange={setOtpModalOpen}>
      <DialogContent className="p-2 sm:p-3 rounded-lg w-[90%] sm:w-[70%] max-w-xl">
        <DialogHeader className="text-center mb-2">
          <DialogTitle className="text-lg sm:text-xl font-bold text-center mb-1">
            Mobile Phone Verification
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            Enter the 6-digit verification code sent to your phone.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-center text-red-500 text-xs mb-1">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <div className="flex justify-center w-full">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-1 sm:gap-2">
                {[...Array(6)].map((_, idx) => (
                  <InputOTPSlot
                    key={idx}
                    className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                    index={idx}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-[50%] text-white cursor-pointer"
            disabled={isSubmitting || otp.length !== 6 || loading}
          >
            Verify
          </Button>
        </form>
        <div className="text-center text-xs text-muted-foreground mt-1">
          <span>
            Attempts left:{' '}
            <span className={remainingAttempts === 0 ? 'text-red-500' : ''}>
              {remainingAttempts}
            </span>
          </span>
          {remainingAttempts === 0 && (
            <span className="ml-2">Attempts reset in: {resetAttemptsCountdownFormatted}</span>
          )}
        </div>
        <div className="text-center text-xs text-muted-foreground mt-1">
          <Button
            variant="link"
            className="p-0 h-auto text-blue-500 cursor-pointer hover:underline disabled:text-gray-400"
            onClick={resend}
            disabled={cooldown > 0 || remainingAttempts === 0}
          >
            {remainingAttempts !== 0 &&
              (cooldown > 0
                ? `Didn’t receive code? Resend (in ${cooldown}s)`
                : 'Didn’t receive code? Resend')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
