'use client';

import { cn } from 'lib/utils';

export type DeliveryStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "return_initiated"
  | "returned"
  | "cancelled";

const DEFAULT_STEPS: { key: DeliveryStatus; label: string }[] = [
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

function normalizeStatus(status?: string | null): DeliveryStatus | null {
  if (!status) return null;
  const s = status.toLowerCase();
  // Map common variants
  if (s === "pending") return "pending";
  if (s === "processing") return "processing";
  if (s === "packed") return "packed";
  if (s === "shipped" || s === "in_transit") return "shipped";
  if (s === "out_for_delivery" || s === "out for delivery") return "out_for_delivery" as DeliveryStatus;
  if (s === "delivered") return "delivered";
  if (s === "returned" || s === "rto_delivered") return "returned";
  if (s === "return_initiated" || s === "rto_initiated") return "return_initiated";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return s as DeliveryStatus;
}

function getStepIndex(status: DeliveryStatus | null): number {
  if (!status) return 0;
  switch (status) {
    case "pending":
    case "processing":
      return 0;
    case "packed":
      return 1;
    case "shipped":
      return 2;
    case "out_for_delivery":
      return 3;
    case "delivered":
      return 4;
    case "return_initiated":
    case "returned":
    case "cancelled":
      // Terminal states: set to the end for visualization
      return 4;
    default:
      return 0;
  }
}

interface OrderStatusStepperProps {
  status?: string | null;
  className?: string;
}

export default function OrderStatusStepper({ status, className }: OrderStatusStepperProps) {
  const norm = normalizeStatus(status);
  const activeIdx = getStepIndex(norm);
  const isTerminalReturn = norm === "returned" || norm === "return_initiated";
  const isCancelled = norm === "cancelled";

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Rail */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-muted rounded" />
        {/* Active segment */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-primary rounded transition-all"
          style={{ width: `${(activeIdx / (DEFAULT_STEPS.length - 1)) * 100}%` }}
        />
        {/* Steps */}
        <div className="flex justify-between">
          {DEFAULT_STEPS.map((step, idx) => {
            const reached = idx <= activeIdx;
            return (
              <div key={step.key} className="flex flex-col items-center w-1/5 text-center">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold transition-colors",
                    reached ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground"
                  )}
                >
                  {idx + 1}
                </div>
                <div className={cn("mt-2 text-xs", reached ? "text-foreground" : "text-muted-foreground")}>{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {(isTerminalReturn || isCancelled) && (
        <div className="mt-3 text-xs">
          {isTerminalReturn && (
            <span className="text-amber-600">This order was returned</span>
          )}
          {isCancelled && (
            <span className="text-destructive">This order was cancelled</span>
          )}
        </div>
      )}
    </div>
  );
}

