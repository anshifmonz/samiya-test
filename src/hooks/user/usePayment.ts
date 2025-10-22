'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from 'lib/utils/apiRequest';
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

interface PaymentStatus {
  payment_status: string;
  order_status: string;
  payment_amount: number;
  cf_order_id: string;
  transaction_details?: any;
}

export const usePayment = (orderId?: string) => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const isFirstLoad = useRef(true);

  const getCurrentStatus = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (orderId) params.append('orderId', orderId);

      const { data, error } = await apiRequest(`/api/user/payment/verify?${params.toString()}`, {
        method: 'GET'
      });

      if (!error && !data.error && data) {
        setPaymentStatus(data.data || null);
      }
    } catch (_) {
      // Handle error
    }
  }, [orderId]);

  const verifyPaymentStatus = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      setVerifying(true);
      const { data: verifyData, error: verifyError } = await apiRequest(
        '/api/user/payment/verify',
        {
          method: 'POST',
          body: { orderId }
        }
      );

      if (verifyError || verifyData.error) {
        await getCurrentStatus();
      } else {
        setPaymentStatus(verifyData.data || null);
      }
    } catch (_) {
      await getCurrentStatus();
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  }, [orderId, getCurrentStatus]);

  useEffect(() => {
    if (!isFirstLoad.current || !orderId) {
      setLoading(false);
      return;
    }
    isFirstLoad.current = false;
    verifyPaymentStatus();
  }, [orderId, verifyPaymentStatus]);

  const getStatusIcon = (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16'
    };
    const className = `${sizeClasses[size]} text-muted-foreground animate-spin`;

    if (!paymentStatus) return { icon: Clock, className };

    switch (paymentStatus.payment_status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return { icon: CheckCircle, className: `${sizeClasses[size]} text-green-500` };
      case 'failed':
      case 'dropped':
      case 'cancelled':
        return { icon: XCircle, className: `${sizeClasses[size]} text-red-500` };
      case 'refunded':
        return { icon: CheckCircle, className: `${sizeClasses[size]} text-blue-500` };
      case 'unpaid':
      case 'pending':
      case 'processing':
        return { icon: Clock, className: `${sizeClasses[size]} text-yellow-500` };
      default:
        return { icon: CreditCard, className };
    }
  };

  const getStatusMessage = () => {
    if (verifying) return 'Verifying payment status...';
    if (!paymentStatus) return 'Unable to verify payment status';

    switch (paymentStatus.payment_status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'dropped':
        return 'Payment Dropped';
      case 'cancelled':
        return 'Payment Cancelled';
      case 'refunded':
        return 'Payment Refunded';
      case 'unpaid':
        return 'Payment Unpaid';
      case 'pending':
      case 'processing':
        return 'Payment Pending';
      default:
        return 'Payment Status Unknown';
    }
  };

  const getStatusDescription = () => {
    if (verifying) return 'Please wait while we confirm your payment...';
    if (!paymentStatus)
      return 'We encountered an issue verifying your payment. Please contact support.';

    switch (paymentStatus.payment_status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'Your payment has been processed successfully. Your order is confirmed and you will receive a confirmation email shortly.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support if the issue persists.';
      case 'dropped':
        return 'It looks like you did not complete the payment. You can try again from your orders page or contact support for help.';
      case 'cancelled':
        return 'The payment was cancelled. You can retry the payment or contact support.';
      case 'refunded':
        return 'This payment has been refunded to your original payment method. Check your bank/app for the refund or contact support if you have questions.';
      case 'unpaid':
        return 'The payment for this order is currently unpaid.';
      case 'pending':
      case 'processing':
        return 'Your payment is pending. This may take a few minutes — you will be notified once it is confirmed.';
      default:
        return 'We are unable to determine your payment status. Please contact support.';
    }
  };

  const handleContinue = () => {
    if (paymentStatus?.payment_status === 'completed' || paymentStatus?.payment_status === 'paid') {
      router.push('/user/orders');
    } else if (paymentStatus?.payment_status === 'failed') {
      router.push('/user/cart');
    } else {
      router.push('/user/orders');
    }
  };

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/user/checkout?retry=${orderId}`);
    } else {
      router.push('/user/cart');
    }
  };

  return {
    paymentStatus,
    loading,
    verifying,
    verifyPaymentStatus,
    getStatusIcon,
    getStatusMessage,
    getStatusDescription,
    handleContinue,
    handleRetryPayment
  };
};
