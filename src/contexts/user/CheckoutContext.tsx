import React, { createContext, useContext, ReactNode } from 'react';
import { useCheckout } from 'hooks/user/useCheckout';
import { CheckoutData } from 'types/checkout';
import { Address } from 'types/address';

type CheckoutContextType = ReturnType<typeof useCheckout>;

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

interface CheckoutProviderProps {
  children: ReactNode;
  checkoutData?: CheckoutData;
  addresses: Address[];
}

export const CheckoutProvider = ({ children, checkoutData, addresses }: CheckoutProviderProps) => {
  const value = useCheckout({ checkoutData, addresses });
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined)
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  return context;
};
