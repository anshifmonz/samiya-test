import { useState, useRef } from 'react';
import { apiRequest } from 'utils/apiRequest';

interface UseOtpResult {
  requestOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  cooldown: number;
  resend: () => void;
  reset: () => void;
  otpModalOpen: boolean;
  setOtpModalOpen: (open: boolean) => void;
  verifyingPhone: string;
  onVerifyClick: (phone: string) => Promise<void>;
}

export function useOtp(): UseOtpResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState('');
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = () => {
    setCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestOtp = async (phone: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await apiRequest('/api/user/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        showErrorToast: true,
        errorMessage: 'Failed to send OTP'
      });
      if (error || !data || data.error) throw new Error(data.error || 'Failed to send OTP');
      startCooldown();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onVerifyClick = async (phone: string) => {
    setVerifyingPhone(phone);
    reset();
    const ok = await requestOtp(phone);
    if (ok) setOtpModalOpen(true);
  };

  const verifyOtp = async (otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await apiRequest('/api/user/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: verifyingPhone, otp })
      });
      if (error || !data || data.error) throw new Error(data.error || 'Invalid OTP');
      setOtpModalOpen(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resend = () => setCooldown(0);

  const reset = () => {
    setError(null);
    setCooldown(0);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
  };

  return {
    requestOtp,
    verifyOtp,
    loading,
    error,
    cooldown,
    resend,
    reset,
    otpModalOpen,
    setOtpModalOpen,
    verifyingPhone,
    onVerifyClick
  };
}
