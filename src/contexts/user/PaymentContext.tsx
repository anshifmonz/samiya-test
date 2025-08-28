'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePayment } from 'hooks/user/usePayment';

type PaymentContextType = ReturnType<typeof usePayment>;

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({
  children,
  orderId,
}: {
  children: ReactNode;
  orderId?: string;
}) => {
  const payment = usePayment(orderId);
  return (
    <PaymentContext.Provider value={payment}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};
