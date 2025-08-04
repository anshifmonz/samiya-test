"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building, Wallet, Truck } from "lucide-react";
import AddCardDialog from "./AddCardDialog";
import AddUPIDialog from "./AddUPIDialog";
import WalletDialog from "./WalletDialog";
import { PaymentMethod } from "@/types/payment";

interface AddPaymentOptionsProps {
  onAdd: (method: Omit<PaymentMethod, "id">) => void;
}

const AddPaymentOptions = ({ onAdd }: AddPaymentOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Add Credit/Debit Card */}
      <AddCardDialog onAdd={onAdd}>
        <Card className="bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Add Credit/Debit Card</h3>
            <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
          </CardContent>
        </Card>
      </AddCardDialog>

      {/* Add UPI */}
      <AddUPIDialog onAdd={onAdd}>
        <Card className="bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Smartphone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Add UPI</h3>
            <p className="text-sm text-muted-foreground">Pay using your UPI ID</p>
          </CardContent>
        </Card>
      </AddUPIDialog>

      {/* Net Banking */}
      <Card className="bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200 cursor-pointer">
        <CardContent className="p-6 text-center">
          <Building className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-1">Net Banking</h3>
          <p className="text-sm text-muted-foreground">Pay directly from your bank account</p>
        </CardContent>
      </Card>

      {/* Digital Wallets */}
      <WalletDialog onAdd={onAdd}>
        <Card className="bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Wallet className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Digital Wallets</h3>
            <p className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay & more</p>
          </CardContent>
        </Card>
      </WalletDialog>

      {/* Cash on Delivery */}
      <Card className="bg-profile-card border-profile-border">
        <CardContent className="p-6 text-center">
          <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-1">Cash on Delivery</h3>
          <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
          <Badge variant="outline" className="mt-2">Available</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPaymentOptions;