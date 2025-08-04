"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { PaymentMethod } from "@/types/payment";

interface AddCardDialogProps {
  children: React.ReactNode;
  onAdd: (method: Omit<PaymentMethod, "id">) => void;
}

const AddCardDialog = ({ children, onAdd }: AddCardDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const cardNumber = formData.get("cardNumber") as string;
    const expiry = formData.get("expiry") as string;
    
    const newCard: Omit<PaymentMethod, "id"> = {
      type: "card",
      name: `Visa ending in ${cardNumber.slice(-4)}`,
      details: `Expires ${expiry}`,
      isDefault: false,
      icon: <CreditCard className="w-5 h-5" />
    };
    
    onAdd(newCard);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber" 
              name="cardNumber"
              placeholder="1234 5678 9012 3456" 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input 
                id="expiry" 
                name="expiry"
                placeholder="MM/YY" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv" 
                name="cvv"
                placeholder="123" 
                required 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input 
              id="cardName" 
              name="cardName"
              placeholder="John Doe" 
              required 
            />
          </div>
          <Button type="submit" className="w-full">Add Card</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;