'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { apiRequest } from 'lib/utils/apiRequest';
import {
  type PaymentVerificationRequest,
  type PaymentVerificationResponse,
  type PaymentStatusResponse
} from 'types/payment';

interface PaymentReturnProps {
  orderId?: string;
  status?: string;
}

interface PaymentStatus {
  payment_status: string;
  order_status: string;
  payment_amount: number;
  cf_order_id: string;
  transaction_details?: any;
}

const PaymentReturn = ({ orderId, status }: PaymentReturnProps) => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!isFirstLoad.current) return;
    isFirstLoad.current = false;
    verifyPaymentStatus();
  }, [orderId]);

  const verifyPaymentStatus = async () => {
    try {
      setVerifying(true);

      // First try to verify the payment status
      const requestBody: PaymentVerificationRequest = {
        orderId
      };

      const { data: verifyData, error: verifyError } =
        await apiRequest<PaymentVerificationResponse>('/api/user/payment/verify', {
          method: 'POST',
          body: requestBody
        });

      if (verifyError) {
        console.error('Payment verification failed:', verifyError);
        // If verification fails, try to get current status
        await getCurrentStatus();
      } else {
        setPaymentStatus(verifyData?.data || null);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      await getCurrentStatus();
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const getCurrentStatus = async () => {
    try {
      const params = new URLSearchParams();
      if (orderId) params.append('orderId', orderId);

      const { data, error } = await apiRequest<PaymentStatusResponse>(
        `/api/user/payment/verify?${params.toString()}`,
        {
          method: 'GET'
        }
      );

      if (!error && data) setPaymentStatus(data.data || null);
    } catch (error) {
      console.error('Error getting payment status:', error);
    }
  };

  const getStatusIcon = () => {
    if (!paymentStatus) return <Clock className="h-12 w-12 text-muted-foreground" />;

    switch (paymentStatus.payment_status) {
      case 'completed':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Clock className="h-12 w-12 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    if (verifying) return 'Verifying payment status...';
    if (!paymentStatus) return 'Unable to verify payment status';

    switch (paymentStatus.payment_status) {
      case 'completed':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Payment Status Unknown';
    }
  };

  const getStatusDescription = () => {
    if (verifying) return 'Please wait while we confirm your payment...';
    if (!paymentStatus)
      return 'We encountered an issue verifying your payment. Please contact support.';

    switch (paymentStatus.payment_status) {
      case 'completed':
        return 'Your payment has been processed successfully. Your order is confirmed and you will receive a confirmation email shortly.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support if the issue persists.';
      case 'pending':
        return 'Your payment is being processed. This may take a few minutes. You will be notified once the payment is confirmed.';
      default:
        return 'We are unable to determine your payment status. Please contact support for assistance.';
    }
  };

  const handleContinue = () => {
    if (paymentStatus?.payment_status === 'completed') {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Processing...</h2>
            <p className="text-muted-foreground">Please wait while we verify your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">{getStatusIcon()}</div>
              <CardTitle className="text-2xl">{getStatusMessage()}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg">{getStatusDescription()}</p>

              {paymentStatus && (
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span>₹{paymentStatus.payment_amount.toFixed(2)}</span>
                  </div>
                  {paymentStatus.cf_order_id && (
                    <div className="flex justify-between">
                      <span className="font-medium">Transaction ID:</span>
                      <span className="text-sm font-mono">{paymentStatus.cf_order_id}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Order Status:</span>
                    <span className="capitalize">{paymentStatus.order_status}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {paymentStatus?.payment_status === 'failed' && (
                  <Button onClick={handleRetryPayment} variant="outline">
                    Retry Payment
                  </Button>
                )}

                <Button onClick={handleContinue} className="flex items-center gap-2">
                  {paymentStatus?.payment_status === 'completed' ? 'View Orders' : 'Continue'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {paymentStatus?.payment_status === 'pending' && (
                <div className="mt-6">
                  <Button onClick={verifyPaymentStatus} variant="outline" disabled={verifying}>
                    {verifying ? 'Checking...' : 'Check Status Again'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
