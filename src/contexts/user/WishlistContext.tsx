'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWishlist } from 'hooks/user/useWishlist';
import { WishlistWithProduct } from 'types/wishlist';

type WishlistContextType = ReturnType<typeof useWishlist>;

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({
  children,
  wishlists
}: {
  children: ReactNode;
  wishlists: WishlistWithProduct[] | null;
}) => {
  const wishlist = useWishlist(wishlists);
  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined)
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  return context;
};
