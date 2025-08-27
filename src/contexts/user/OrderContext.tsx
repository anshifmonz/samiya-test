'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useOrder } from 'hooks/user/useOrder';
import { OrderHistory } from 'types/order';

interface OrderContextType extends ReturnType<typeof useOrder> {}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
  initialOrders: OrderHistory[];
}

export const OrderProvider = ({ children, initialOrders }: OrderProviderProps) => {
  const orderData = useOrder(initialOrders);
  return (
    <OrderContext.Provider value={orderData}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined)
    throw new Error('useOrderContext must be used within an OrderProvider');
  return context;
};
