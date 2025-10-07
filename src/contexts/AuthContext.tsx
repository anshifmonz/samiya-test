'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from 'hooks/useAuth';

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const values = useAuth();
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
