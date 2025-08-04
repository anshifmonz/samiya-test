"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { PaymentMethod, WalletOption } from "@/types/payment";

const walletOptions: WalletOption[] = [
  {
    id: "paytm",
    name: "Paytm",
    icon: <Wallet className="w-5 h-5 text-blue-600" />
  },
  {
    id: "phonepe",
    name: "PhonePe",
    icon: <Wallet className="w-5 h-5 text-purple-600" />
  },
  {
    id: "googlepay",
    name: "Google Pay",
    icon: <Wallet className="w-5 h-5 text-green-600" />
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    icon: <Wallet className="w-5 h-5 text-orange-600" />
  }
];

interface WalletDialogProps {
  children: React.ReactNode;
  onAdd: (method: Omit<PaymentMethod, "id">) => void;
}

const WalletDialog = ({ children, onAdd }: WalletDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleWalletSelect = (wallet: WalletOption) => {
    const newWallet: Omit<PaymentMethod, "id"> = {
      type: "wallet",
      name: wallet.name,
      details: "Digital Wallet",
      isDefault: false,
      icon: wallet.icon
    };
    
    onAdd(newWallet);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="h-16 flex-col gap-2"
              onClick={() => handleWalletSelect(wallet)}
            >
              {wallet.icon}
              <span className="text-sm">{wallet.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletDialog;