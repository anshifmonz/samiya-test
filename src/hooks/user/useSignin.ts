'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from 'lib/utils/apiRequest';
import { useAuthContext } from 'contexts/AuthContext';
import { useOtpContext } from 'contexts/user/shared/OtpContext';

export const useSignin = (onSuccess: () => void) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshSession } = useAuthContext();

  const { onVerifyClick, isVerified, verifyToken, loading: otpLoading } = useOtpContext();

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
          onSuccess();
        } else {
          setError(error || 'Signin failed');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSession, onSuccess]
  );

  useEffect(() => {
    if (isVerified && verifyToken) {
      handleSignin(verifyToken);
    }
  }, [isVerified, verifyToken, handleSignin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    await onVerifyClick(phone);
  };

  return {
    phone,
    setPhone,
    isLoading,
    error,
    handleSubmit,
    otpLoading
  };
};