'use client';

import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';
import EmptyCart from './EmptyCart';
import CartSummary from './CartSummary';
import CartItemsList from './CartItemsList';
import { CartItem } from 'types/cart';
import { CartProvider, useCartContext } from 'contexts/CartContext';

interface CartProps {
  initialCartItems: CartItem[];
}

const CartContent = () => {
  const { cartItems, handleGoBack } = useCartContext();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>

          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <CartItemsList />
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

const Cart = ({ initialCartItems }: CartProps) => {
  return (
    <CartProvider initialCartItems={initialCartItems}>
      <CartContent />
    </CartProvider>
  );
};

export default Cart;
