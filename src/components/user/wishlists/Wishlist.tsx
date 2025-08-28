'use client';

import { WishlistProvider, useWishlistContext } from 'contexts/user/WishlistContext';
import WishlistGrid from './WishlistGrid';
import EmptyWishlist from './EmptyWishlist';
import { WishlistWithProduct } from 'types/wishlist';

interface WishlistProps {
  wishlists: WishlistWithProduct[] | null;
}

const WishlistContent = () => {
  const { wishlistItems, loading } = useWishlistContext();

  return (
    <div className="min-h-screen bg-profile-bg pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? <EmptyWishlist /> : <WishlistGrid />}

        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-background p-4 rounded-lg shadow-lg flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground mr-3"></div>
              <span>Updating wishlist...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Wishlist = ({ wishlists }: WishlistProps) => {
  return (
    <WishlistProvider wishlists={wishlists}>
      <WishlistContent />
    </WishlistProvider>
  );
};

export default Wishlist;
