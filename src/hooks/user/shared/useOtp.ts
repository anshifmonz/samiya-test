// src/hooks/useOtp.ts
import { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from 'lib/firebase/firebase';

declare global {
  interface Window {
    __MY_APP_RECAPTCHA_VERIFIER?: RecaptchaVerifier | null;
  }
}

export interface UseOtpOptions {
  countryCode?: string;
  maxAttempts?: number;
  attemptResetInterval?: number; // ms
  cooldownSeconds?: number;
  recaptchaContainerId?: string;
}

export interface UseOtpResult {
  requestOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  isVerified: boolean;
  cooldown: number;
  remainingAttempts: number;
  verifyToken: string;
  resetAttemptsCountdown: number; // seconds until attempts reset
  resetAttemptsCountdownFormatted: string;
  resend: () => Promise<boolean>;
  reset: () => void;
  otpModalOpen: boolean;
  setOtpModalOpen: (open: boolean) => void;
  verifyingPhone: string;
  onVerifyClick: (phone: string) => Promise<void>;
}

export function useOtp(options: UseOtpOptions = {}): UseOtpResult {
  const {
    countryCode = '+91',
    maxAttempts = 5,
    attemptResetInterval = 60 * 60 * 1000, // 1 hour
    cooldownSeconds = 60,
    recaptchaContainerId = 'recaptcha-container'
  } = options;

  const COOLDOWN_STORAGE_KEY = 'otpCooldownEndTime';
  const ATTEMPTS_STORAGE_KEY = 'otpAttemptCount';
  const ATTEMPTS_TIMESTAMP_KEY = 'otpAttemptTimestamp';
  const GLOBAL_RECAPTCHA_KEY = '__MY_APP_RECAPTCHA_VERIFIER';

  // UI / state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');

  // attempts state
  const [attempts, setAttempts] = useState(0);
  const [resetAttemptsCountdown, setResetAttemptsCountdown] = useState(0);

  // refs
  const cooldownIntervalRef = useRef<number | null>(null);
  const attemptsCountdownIntervalRef = useRef<number | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const confirmationResult = useRef<ConfirmationResult | null>(null);

  // ---- helpers ----
  const formatSeconds = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  function messageIncludesInvalidAppCredential(err: unknown) {
    const s = String((err as any)?.message ?? (err as any)?.error ?? '');
    return s.includes('INVALID_APP_CREDENTIAL') || s.includes('invalid_app_credential');
  }

  const getFriendlyErrorMessage = (err: unknown) => {
    const code = (err as any)?.code ?? '';
    if (typeof code === 'string') {
      switch (code) {
        case 'auth/invalid-phone-number':
          return 'The phone number is invalid. Please check and try again.';
        case 'auth/too-many-requests':
          return 'You have requested OTP too many times. Please try again later.';
        case 'auth/quota-exceeded':
          return 'SMS quota exceeded. Please try again later.';
        case 'auth/code-expired':
          return 'The OTP has expired. Please request a new one.';
        case 'auth/invalid-verification-code':
          return 'Invalid OTP. Please check the code and try again.';
        case 'auth/billing-not-enabled':
          return 'Phone auth requires billing (Blaze). Please enable billing in Firebase Console.';
      }
    }
    if (messageIncludesInvalidAppCredential(err)) {
      return 'reCAPTCHA verification failed or app credential invalid. Ensure Authorized Domains include this origin and billing is enabled if using reCAPTCHA Enterprise.';
    }
    return 'Failed to send OTP. Please try again.';
  };

  // ---- attempts/cooldown management ----
  const updateAttemptsFromStorage = () => {
    try {
      const storedAttempts = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(ATTEMPTS_TIMESTAMP_KEY);

      if (storedAttempts && storedTimestamp) {
        const lastAttemptTime = parseInt(storedTimestamp, 10);
        const now = Date.now();
        const diff = now - lastAttemptTime;

        if (diff >= attemptResetInterval) {
          localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
          localStorage.removeItem(ATTEMPTS_TIMESTAMP_KEY);
          setAttempts(0);
          setResetAttemptsCountdown(0);
        } else {
          setAttempts(parseInt(storedAttempts, 10));
          setResetAttemptsCountdown(Math.round((attemptResetInterval - diff) / 1000));
        }
      } else {
        setAttempts(0);
        setResetAttemptsCountdown(0);
      }
    } catch (e) {
      setAttempts(0);
      setResetAttemptsCountdown(0);
    }
  };

  const remainingAttempts = Math.max(0, maxAttempts - attempts);

  const runCooldownTimer = (endTime: number) => {
    if (cooldownIntervalRef.current) window.clearInterval(cooldownIntervalRef.current);
    const update = () => {
      const remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        setCooldown(0);
        if (cooldownIntervalRef.current) {
          window.clearInterval(cooldownIntervalRef.current);
          cooldownIntervalRef.current = null;
        }
      } else {
        setCooldown(Math.round(remainingTime / 1000));
      }
    };
    update();
    cooldownIntervalRef.current = window.setInterval(update, 1000);
  };

  const runAttemptsCountdown = () => {
    if (attemptsCountdownIntervalRef.current)
      window.clearInterval(attemptsCountdownIntervalRef.current);

    const update = () => {
      const storedTimestamp = localStorage.getItem(ATTEMPTS_TIMESTAMP_KEY);
      if (!storedTimestamp) {
        setResetAttemptsCountdown(0);
        if (attemptsCountdownIntervalRef.current) {
          window.clearInterval(attemptsCountdownIntervalRef.current);
          attemptsCountdownIntervalRef.current = null;
        }
        return;
      }

      const lastAttemptTime = parseInt(storedTimestamp, 10);
      const now = Date.now();
      const diff = attemptResetInterval - (now - lastAttemptTime);

      if (diff <= 0) {
        localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
        localStorage.removeItem(ATTEMPTS_TIMESTAMP_KEY);
        setAttempts(0);
        setResetAttemptsCountdown(0);
        if (attemptsCountdownIntervalRef.current) {
          window.clearInterval(attemptsCountdownIntervalRef.current);
          attemptsCountdownIntervalRef.current = null;
        }
      } else {
        setResetAttemptsCountdown(Math.round(diff / 1000));
      }
    };

    update();
    attemptsCountdownIntervalRef.current = window.setInterval(update, 1000);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateAttemptsFromStorage();
    runAttemptsCountdown();

    const storedEndTime = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (storedEndTime) runCooldownTimer(parseInt(storedEndTime, 10));

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COOLDOWN_STORAGE_KEY) {
        if (event.newValue) runCooldownTimer(parseInt(event.newValue, 10));
        else {
          if (cooldownIntervalRef.current) {
            window.clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          setCooldown(0);
        }
      }
      if (event.key === ATTEMPTS_STORAGE_KEY || event.key === ATTEMPTS_TIMESTAMP_KEY) {
        updateAttemptsFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (cooldownIntervalRef.current) {
        window.clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
      }
      if (attemptsCountdownIntervalRef.current) {
        window.clearInterval(attemptsCountdownIntervalRef.current);
        attemptsCountdownIntervalRef.current = null;
      }
      // DO NOT clear global recaptcha verifier here — keep it stable across HMR/dev
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptResetInterval]);

  // ---- reCAPTCHA init (singleton, persistent) ----
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let container = document.getElementById(recaptchaContainerId);
    if (!container) {
      container = document.createElement('div');
      container.id = recaptchaContainerId;
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    if ((window as any)[GLOBAL_RECAPTCHA_KEY]) {
      recaptchaVerifier.current = (window as any)[GLOBAL_RECAPTCHA_KEY] as RecaptchaVerifier;
    } else {
      try {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, { size: 'invisible' });
        recaptchaVerifier.current = verifier;
        (window as any)[GLOBAL_RECAPTCHA_KEY] = verifier;
        // attempt to render but don't block; log non-fatal render failures
        verifier.render().catch(e => {
          console.warn('reCAPTCHA render failed (non-fatal):', e);
        });
      } catch (e) {
        console.error('recaptcha init failed:', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recaptchaContainerId]);

  // ---- helpers to start cooldown & attempts ----
  const startCooldown = (seconds = cooldownSeconds) => {
    const now = Date.now();
    localStorage.setItem(ATTEMPTS_TIMESTAMP_KEY, String(now));
    runAttemptsCountdown();

    const endTime = now + seconds * 1000;
    localStorage.setItem(COOLDOWN_STORAGE_KEY, String(endTime));
    runCooldownTimer(endTime);

    setTimeout(() => {
      const currentEndTime = localStorage.getItem(COOLDOWN_STORAGE_KEY);
      if (currentEndTime && parseInt(currentEndTime, 10) === endTime) {
        localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      }
    }, seconds * 1000);
  };

  const incrementAttempts = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const now = Date.now();
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, String(newAttempts));
    localStorage.setItem(ATTEMPTS_TIMESTAMP_KEY, String(now));
    runAttemptsCountdown();
  };

  // ---- ensure recaptcha readiness helper (await render with timeout) ----
  const ensureRecaptchaReady = async (timeoutMs = 5000) => {
    if (typeof window === 'undefined') throw new Error('Recaptcha only available in browser');
    if (!recaptchaVerifier.current) {
      // try to reuse global if available
      recaptchaVerifier.current = (window as any)[GLOBAL_RECAPTCHA_KEY] ?? null;
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: 'invisible'
        });
        (window as any)[GLOBAL_RECAPTCHA_KEY] = recaptchaVerifier.current;
      }
    }
    try {
      // Promise.race so we don't wait forever
      await Promise.race([
        recaptchaVerifier.current!.render(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('recaptcha render timeout')), timeoutMs)
        )
      ]);
      return true;
    } catch (e) {
      console.warn('recaptcha readiness issue:', e);
      return false;
    }
  };

  // ---- requestOtp ----
  const requestOtp = async (phone: string, isResend = false): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // Pre-check attempts
    if (attempts >= maxAttempts) {
      setError(`Too many attempts. Please try again in ${formatSeconds(resetAttemptsCountdown)}.`);
      setLoading(false);
      return false;
    }

    // If not a resend and attempts exist but no remaining, block
    if (!isResend && attempts > 0 && remainingAttempts <= 0) {
      setLoading(false);
      return false;
    }

    try {
      const formatted = ((): string | null => {
        const digits = phone.trim().replace(/\D/g, '');
        return digits.length === 10 ? `${countryCode}${digits}` : null;
      })();
      if (!formatted) throw { code: 'auth/invalid-phone-number' };

      // ensure recaptcha ready (try short wait)
      const ready = await ensureRecaptchaReady(4000);
      if (!ready) {
        // If recaptcha couldn't render, we'll still try signInWithPhoneNumber; it may fallback,
        // but warn user about potential domain/billing issues.
        console.warn('reCAPTCHA not fully ready; signInWithPhoneNumber may fail.');
      }

      const result = await signInWithPhoneNumber(
        auth,
        formatted,
        recaptchaVerifier.current as RecaptchaVerifier
      );
      confirmationResult.current = result;

      incrementAttempts();
      startCooldown(cooldownSeconds);
      return true;
    } catch (err: unknown) {
      setError(getFriendlyErrorMessage(err));
      if (
        messageIncludesInvalidAppCredential(err) ||
        (err as any)?.code === 'auth/billing-not-enabled'
      ) {
        console.warn(
          'OTP send failed due to recaptcha / billing status. Check Authorized Domains & billing.'
        );
      } else {
        console.error('requestOtp error:', err);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ---- onVerifyClick & verifyOtp ----
  const onVerifyClick = async (phone: string) => {
    setVerifyingPhone(phone);
    setError(null);
    if (cooldown > 0) {
      setOtpModalOpen(true);
      return;
    }
    const ok = await requestOtp(phone);
    if (ok || attempts > 0) setOtpModalOpen(true);
  };

  const verifyOtp = async (otp: string) => {
    setLoading(true);
    setError(null);
    if (!confirmationResult.current) {
      setError('Please request an OTP first.');
      setLoading(false);
      return false;
    }
    try {
      const userCredential = await confirmationResult.current.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      setVerifyToken(idToken);
      confirmationResult.current = null;

      setIsVerified(true);
      // keep verifyToken & isVerified; clear flow state
      reset();
      setOtpModalOpen(false);
      return true;
    } catch (err: unknown) {
      setError(getFriendlyErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ---- resend / reset ----
  const resend = async () => {
    if (!verifyingPhone) {
      setError('No phone number was provided to resend the OTP.');
      return false;
    }
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before resending.`);
      return false;
    }
    return await requestOtp(verifyingPhone, true);
  };

  const reset = () => {
    setError(null);
    setCooldown(0);
    setAttempts(0);
    setResetAttemptsCountdown(0);
    if (cooldownIntervalRef.current) {
      window.clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }
    if (attemptsCountdownIntervalRef.current) {
      window.clearInterval(attemptsCountdownIntervalRef.current);
      attemptsCountdownIntervalRef.current = null;
    }
    try {
      localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      localStorage.removeItem(ATTEMPTS_TIMESTAMP_KEY);
    } catch (e) {
      // ignore storage errors
    }
    confirmationResult.current = null;
    // NOTE: do not clear global verifier by default (keeps it stable across HMR).
  };

  const resetAttemptsCountdownFormatted = formatSeconds(resetAttemptsCountdown);

  return {
    requestOtp,
    verifyOtp,
    loading,
    error,
    isVerified,
    cooldown,
    remainingAttempts,
    verifyToken,
    resetAttemptsCountdown,
    resetAttemptsCountdownFormatted,
    resend,
    reset,
    otpModalOpen,
    setOtpModalOpen,
    verifyingPhone,
    onVerifyClick
  };
}
