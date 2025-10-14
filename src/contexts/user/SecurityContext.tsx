'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSecurity } from 'hooks/user/useSecurity';
import { UserProfile } from 'types/user';

type SecurityContextType = ReturnType<typeof useSecurity>;

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityContextProvider = ({
  profile,
  children
}: {
  profile: UserProfile;
  children: ReactNode;
}) => {
  const value = useSecurity(profile);
  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
};

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined)
    throw new Error('useSecurityContext must be used within a SecurityContextProvider');
  return context;
};
