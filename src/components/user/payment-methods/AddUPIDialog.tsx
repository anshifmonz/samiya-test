"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Smartphone } from "lucide-react";
import { PaymentMethod } from "@/types/payment";

interface AddUPIDialogProps {
  children: React.ReactNode;
  onAdd: (method: Omit<PaymentMethod, "id">) => void;
}

const AddUPIDialog = ({ children, onAdd }: AddUPIDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const upiId = formData.get("upiId") as string;
    
    const newUPI: Omit<PaymentMethod, "id"> = {
      type: "upi",
      name: upiId,
      details: "UPI ID",
      isDefault: false,
      icon: <Smartphone className="w-5 h-5" />
    };
    
    onAdd(newUPI);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add UPI ID</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input 
              id="upiId" 
              name="upiId"
              placeholder="yourname@paytm" 
              required 
            />
          </div>
          <Button type="submit" className="w-full">Add UPI ID</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUPIDialog;