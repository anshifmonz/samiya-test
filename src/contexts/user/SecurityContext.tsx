'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSecurity } from 'hooks/user/useSecurity';

type SecurityContextType = ReturnType<typeof useSecurity>;

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityContextProvider = ({ children }: { children: ReactNode }) => {
  const value = useSecurity();
  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined)
    throw new Error('useSecurityContext must be used within a SecurityContextProvider');
  return context;
};
