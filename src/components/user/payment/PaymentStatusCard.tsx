'use client';

import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Button } from 'ui/button';
import { CheckCircle, XCircle, Clock, RefreshCw, CreditCard } from 'lucide-react';
import PaymentStatus from './PaymentStatus';

interface PaymentStatusCardProps {
  orderId: string;
  paymentStatus: string;
  orderStatus: string;
  amount: number;
  transactionId?: string;
  onRetryPayment?: () => void;
  onRefreshStatus?: () => void;
  isRefreshing?: boolean;
}

const PaymentStatusCard = ({
  orderId,
  paymentStatus,
  orderStatus,
  amount,
  transactionId,
  onRetryPayment,
  onRefreshStatus,
  isRefreshing = false
}: PaymentStatusCardProps) => {
  const getStatusIcon = () => {
    switch (paymentStatus?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      default:
        return <CreditCard className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'Payment Successful';
      case 'failed':
      case 'cancelled':
        return 'Payment Failed';
      case 'pending':
      case 'processing':
        return 'Payment Processing';
      default:
        return 'Payment Status Unknown';
    }
  };

  const getStatusDescription = () => {
    switch (paymentStatus?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'Your payment has been processed successfully. Your order is confirmed.';
      case 'failed':
      case 'cancelled':
        return 'Your payment could not be processed. You can retry the payment or contact support.';
      case 'pending':
      case 'processing':
        return 'Your payment is being processed. This may take a few minutes.';
      default:
        return 'We are unable to determine your payment status. Please contact support.';
    }
  };

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">{getStatusIcon()}</div>
        <CardTitle className="text-xl">{getStatusMessage()}</CardTitle>
        <p className="text-muted-foreground">{getStatusDescription()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Order ID:</span>
            <span className="text-sm font-mono">#{orderId.slice(-8)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Amount:</span>
            <span className="font-semibold">₹{amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Payment Status:</span>
            <PaymentStatus status={paymentStatus} size="sm" />
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Order Status:</span>
            <span className="capitalize text-sm">{orderStatus}</span>
          </div>

          {transactionId && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Transaction ID:</span>
              <span className="text-sm font-mono">{transactionId}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {paymentStatus?.toLowerCase() === 'failed' && onRetryPayment && (
            <Button onClick={onRetryPayment} variant="outline" className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              Retry Payment
            </Button>
          )}

          {(paymentStatus?.toLowerCase() === 'pending' ||
            paymentStatus?.toLowerCase() === 'processing') &&
            onRefreshStatus && (
              <Button
                onClick={onRefreshStatus}
                variant="outline"
                disabled={isRefreshing}
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Checking...' : 'Refresh Status'}
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusCard;
