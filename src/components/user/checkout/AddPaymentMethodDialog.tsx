"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import { Button } from "ui/button";
import { Label } from "ui/label";
import { Input } from "ui/input";
import { CreditCard, type CreditCardValue } from "ui/credit-card";
import { Smartphone, CreditCard as CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AddPaymentMethodPayload =
  | {
      type: "card";
      instrument_id?: string; // token from gateway (not available here)
      display_name: string; // e.g., VISA
      last4: string;
      upi_id?: undefined;
    }
  | {
      type: "upi";
      instrument_id?: undefined;
      display_name: string; // e.g., UPI
      last4?: undefined;
      upi_id: string;
    };

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: (payload: AddPaymentMethodPayload) => void;
}

const upiRegex = /^[a-zA-Z0-9._\-]{2,256}@[a-zA-Z]{2,64}$/;

export default function AddPaymentMethodDialog({ open, onOpenChange, onAdded }: AddPaymentMethodDialogProps) {
  const [tab, setTab] = React.useState<"card" | "upi">("card");

  // Card state/validation
  const cardRef = React.useRef<any>(null);
  const [card, setCard] = React.useState<CreditCardValue>({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [cardValid, setCardValid] = React.useState(false);

  // UPI state/validation
  const [upiId, setUpiId] = React.useState("");
  const [upiError, setUpiError] = React.useState<string | null>(null);

  const resetAll = () => {
    setCard({ cardholderName: "", cardNumber: "", expiryMonth: "", expiryYear: "", cvv: "" });
    setCardValid(false);
    setUpiId("");
    setUpiError(null);
    setTab("card");
  };

  const handleClose = (next: boolean) => {
    if (!next) resetAll();
    onOpenChange(next);
  };

  const handleAddCard = () => {
    if (cardRef.current && !cardRef.current.isValid()) {
      cardRef.current.validate();
      return;
    }

    // Derive display name and last4. In real flow, instrument_id comes from gateway tokenization
    const digits = card.cardNumber.replace(/\s+/g, "");
    const last4 = digits.slice(-4);
    const display_name = inferCardBrand(digits) || "Card";

    const payload: AddPaymentMethodPayload = {
      type: "card",
      display_name,
      last4,
    };

    onAdded?.(payload);
    handleClose(false);
  };

  const handleAddUpi = () => {
    const value = upiId.trim();
    if (!upiRegex.test(value)) {
      setUpiError("Enter a valid UPI ID like username@bank");
      return;
    }

    const payload: AddPaymentMethodPayload = {
      type: "upi",
      display_name: "UPI",
      upi_id: value,
    };

    onAdded?.(payload);
    handleClose(false);
  };

  const onUpiChange = (val: string) => {
    setUpiId(val);
    if (!val) setUpiError("UPI ID is required");
    else if (!upiRegex.test(val)) setUpiError("Invalid UPI ID format");
    else setUpiError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn("max-w-lg w-[95vw] p-0 overflow-hidden")}>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg sm:text-xl">Add Payment Method</DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4" /> Card
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> UPI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="mt-4">
              <div className="space-y-4">
                <CreditCard
                  ref={cardRef as any}
                  value={card}
                  onChange={setCard}
                  onValidationChange={(isValid) => setCardValid(isValid)}
                  cardStyle="metal"
                  className="w-full"
                />
                <Button className="w-full mt-2" disabled={!cardValid} onClick={handleAddCard}>
                  Save Card
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upi" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => onUpiChange(e.target.value)}
                    placeholder="yourname@bank"
                    autoComplete="off"
                    inputMode="email"
                  />
                  {upiError && (
                    <p className="text-sm text-destructive mt-1">{upiError}</p>
                  )}
                </div>
                <Button className="w-full" disabled={!!upiError || !upiId} onClick={handleAddUpi}>
                  Save UPI
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function inferCardBrand(cardNumberDigits: string): string | null {
  // Basic IIN detection (simplified)
  if (/^4/.test(cardNumberDigits)) return "VISA";
  if (/^(5[1-5])/.test(cardNumberDigits)) return "Mastercard";
  if (/^3[47]/.test(cardNumberDigits)) return "AMEX";
  if (/^6(?:011|5)/.test(cardNumberDigits)) return "Discover";
  return null;
}

