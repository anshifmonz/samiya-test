'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import UserSigninModal from 'components/auth/UserSigninModal';

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  onSigninSuccess: () => void;
  setOnSigninSuccess: (callback: () => void) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [onSigninSuccess, setOnSigninSuccess] = useState<() => void>(() => () => {});

  const value = useMemo(
    () => ({
      isAuthModalOpen,
      setAuthModalOpen,
      onSigninSuccess,
      setOnSigninSuccess: (callback: () => void) => setOnSigninSuccess(() => callback)
    }),
    [isAuthModalOpen, onSigninSuccess]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <UserSigninModal
        open={isAuthModalOpen}
        onOpenChange={setAuthModalOpen}
        onSigninSuccess={onSigninSuccess}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined)
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  return context;
};
