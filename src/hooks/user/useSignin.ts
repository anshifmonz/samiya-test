'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from 'lib/utils/apiRequest';
import { useAuthContext } from 'contexts/AuthContext';
import { useOtpContext } from 'contexts/user/shared/OtpContext';

export const useSignin = (onSuccess: () => void) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshSession } = useAuthContext();

  const { onVerifyClick, isVerified, verifyToken, loading: otpLoading } = useOtpContext();

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const handleSignin = useCallback(
    async (token: string) => {
      setIsLoading(true);
      setError('');
      try {
        const { error } = await apiRequest('/api/auth/signin', {
          method: 'POST',
          body: { token },
          showLoadingBar: true,
          showErrorToast: false
        });

        if (!error) {
          await refreshSession();
          onSuccessRef.current();
        } else {
          setError(error || 'Signin failed');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSession]
  );

  const hasSignedInInitially = useRef(false);

  // This effect handles the automatic sign-in ONLY on the first successful OTP verification.
  useEffect(() => {
    if (isVerified && verifyToken && !hasSignedInInitially.current) {
      hasSignedInInitially.current = true;
      handleSignin(verifyToken);
    }
  }, [isVerified, verifyToken, handleSignin]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number.');
        return;
      }
      setError('');

      // If the OTP is already verified, this is a manual retry. Call sign-in directly.
      if (isVerified && verifyToken) {
        handleSignin(verifyToken);
        return;
      }

      // Otherwise, it's a new attempt. Reset the initial sign-in guard and trigger the OTP flow.
      hasSignedInInitially.current = false;
      await onVerifyClick(phone);
    },
    [phone, onVerifyClick, isVerified, verifyToken, handleSignin]
  );

  return {
    phone,
    setPhone,
    isLoading,
    error,
    handleSubmit,
    otpLoading
  };
};
