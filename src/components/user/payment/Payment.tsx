'use client';

import { Button } from 'ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { PaymentProvider, usePaymentContext } from 'contexts/user/PaymentContext';

interface PaymentProps {
  orderId?: string;
}

const PaymentContent = () => {
  const {
    paymentStatus,
    loading,
    verifying,
    verifyPaymentStatus,
    getStatusIcon,
    getStatusMessage,
    getStatusDescription,
    handleContinue,
    handleRetryPayment
  } = usePaymentContext();

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
              <div className="flex justify-center mb-4">
                {(() => {
                  const { icon: Icon, className } = getStatusIcon();
                  return <Icon className={className} />;
                })()}
              </div>
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

const Payment = ({ orderId }: PaymentProps) => {
  return (
    <PaymentProvider orderId={orderId}>
      <PaymentContent />
    </PaymentProvider>
  );
};

export default Payment;
