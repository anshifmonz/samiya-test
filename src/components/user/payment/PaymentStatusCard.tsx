'use client';

import { Button } from 'ui/button';
import { RefreshCw, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import PaymentStatus from './PaymentStatus';
import { usePaymentContext, PaymentProvider } from 'contexts/user/PaymentContext';

interface PaymentStatusCardProps {
  orderId: string;
}

const PaymentStatusCardContent = () => {
  const {
    paymentStatus,
    verifying,
    verifyPaymentStatus,
    handleRetryPayment,
    getStatusIcon,
    getStatusMessage,
    getStatusDescription
  } = usePaymentContext();

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          {(() => {
            const { icon: Icon, className } = getStatusIcon('sm');
            return <Icon className={className} />;
          })()}
        </div>
        <CardTitle className="text-xl">{getStatusMessage()}</CardTitle>
        <p className="text-muted-foreground">{getStatusDescription()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentStatus && (
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order ID:</span>
              <span className="text-sm font-mono">#{paymentStatus.cf_order_id.slice(-8)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Amount:</span>
              <span className="font-semibold">₹{paymentStatus.payment_amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Status:</span>
              <PaymentStatus status={paymentStatus.payment_status} size="sm" />
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Order Status:</span>
              <span className="capitalize text-sm">{paymentStatus.order_status}</span>
            </div>

            {paymentStatus.cf_order_id && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Transaction ID:</span>
                <span className="text-sm font-mono">{paymentStatus.cf_order_id}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {(paymentStatus?.payment_status.toLowerCase() === 'failed' ||
            paymentStatus?.payment_status.toLowerCase() === 'cancelled') && (
            <Button onClick={handleRetryPayment} variant="outline" className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              Retry Payment
            </Button>
          )}

          {(paymentStatus?.payment_status.toLowerCase() === 'pending' ||
            paymentStatus?.payment_status.toLowerCase() === 'processing') && (
            <Button
              onClick={verifyPaymentStatus}
              variant="outline"
              disabled={verifying}
              className="flex-1"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${verifying ? 'animate-spin' : ''}`} />
              {verifying ? 'Checking...' : 'Refresh Status'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentStatusCard = ({ orderId }: PaymentStatusCardProps) => {
  return (
    <PaymentProvider orderId={orderId}>
      <PaymentStatusCardContent />
    </PaymentProvider>
  );
};

export default PaymentStatusCard;
