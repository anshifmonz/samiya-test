'use client';

import { cn } from 'lib/utils';
import { useOrderContext } from 'contexts/user/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const DEFAULT_STEPS = [
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
];

export default function OrderStatusStepper({ className }: { className?: string }) {
  const { getStepIndex, isFetcingshipmentInfo, shipmentInfo } = useOrderContext();

  if (isFetcingshipmentInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn('w-full', className)}>
            <div className="flex flex-col gap-4 items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <div className="text-sm text-muted-foreground mt-2">Fetching shipment info...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mappedStatus = shipmentInfo?.status;
  const activeIdx = getStepIndex(mappedStatus as any);
  const isTerminalReturn = mappedStatus === 'returned' || mappedStatus === 'return_initiated';
  const isCancelled = mappedStatus === 'cancelled';

  const getStepStatus = (stepKey: string) => {
    const stepIndex = DEFAULT_STEPS.findIndex(step => step.key === stepKey);
    if (isCancelled || isTerminalReturn) return 'cancelled';
    if (stepIndex < activeIdx) return 'completed';
    if (stepIndex === activeIdx) return 'current';
    return 'pending';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('w-full', className)}>
          <div className="flex flex-col gap-0">
            {DEFAULT_STEPS.map((step, idx) => {
              const status = getStepStatus(step.key);
              const Icon = step.icon;
              const isLast = idx === DEFAULT_STEPS.length - 1;
              return (
                <div key={step.key} className="relative flex items-start gap-4 pb-6">
                  {/* Connecting Line */}
                  {!isLast && <div className="absolute left-3 top-8 w-0.5 h-full bg-border" />}
                  {/* Status Circle */}
                  <div
                    className={cn(
                      'relative z-10 w-6 h-6 rounded-full flex items-center justify-center',
                      status === 'completed' || status === 'current'
                        ? 'bg-green-500 text-white'
                        : status === 'cancelled'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted border-2 border-border'
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : status === 'cancelled' ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'font-medium',
                        status === 'completed' || status === 'current'
                          ? 'text-foreground'
                          : status === 'cancelled'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {status === 'completed' && 'Completed'}
                      {status === 'current' && 'In Progress'}
                      {status === 'pending' && ''}
                      {status === 'cancelled' && ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {(isTerminalReturn || isCancelled) && (
            <div className="mt-3 text-xs">
              {isTerminalReturn && <span className="text-amber-600">This order was returned</span>}
              {isCancelled && <span className="text-destructive">This order was cancelled</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
