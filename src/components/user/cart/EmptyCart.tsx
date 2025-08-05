'use client';

import { Button } from 'ui/button';
import { ShoppingBag } from 'lucide-react';

interface EmptyCartProps {
  onContinueShopping: () => void;
}

const EmptyCart = ({ onContinueShopping }: EmptyCartProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">Add some items to get started</p>
      <Button onClick={onContinueShopping}>
        Continue Shopping
      </Button>
    </div>
  );
};

export default EmptyCart;
