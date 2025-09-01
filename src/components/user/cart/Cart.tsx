'use client';

import EmptyCart from './EmptyCart';
import CartSummary from './CartSummary';
import CartItemsList from './CartItemsList';
import { CartItem } from 'types/cart';
import { CartProvider, useCartContext } from 'contexts/user/CartContext';

interface CartProps {
  initialCartItems: CartItem[];
}

const CartContent = () => {
  const { cartItems } = useCartContext();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-28">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-2 sm:px-4 py-8">
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
