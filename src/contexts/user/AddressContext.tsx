'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAddress } from 'hooks/user/useAddress';
import { AddressDisplay } from 'types/address';

type AddressContextType = ReturnType<typeof useAddress>;

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({
  children,
  initialAddresses,
}: {
  children: ReactNode;
  initialAddresses: AddressDisplay[];
}) => {
  const address = useAddress(initialAddresses);
  return (
    <AddressContext.Provider value={address}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddressContext must be used within a AddressProvider');
  }
  return context;
};
