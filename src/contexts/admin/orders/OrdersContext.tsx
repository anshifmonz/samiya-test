'use client';

import { createContext, useContext } from 'react';
import { useOrdersLogic } from 'hooks/admin/orders/useOrders';

const OrdersContext = createContext<ReturnType<typeof useOrdersLogic> | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useOrdersLogic();

  return <OrdersContext.Provider value={contextValue}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) throw new Error('useOrders must be used within an OrdersProvider');
  return context;
};
