'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { CartItem } from 'types/cart';
import { useCart } from 'hooks/user/useCart';

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialCartItems: CartItem[];
}

export const CartProvider = ({ children, initialCartItems }: CartProviderProps) => {
  const cartData = useCart({ initialCartItems });

  return <CartContext.Provider value={cartData}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCartContext must be used within a CartProvider');
  return context;
};
