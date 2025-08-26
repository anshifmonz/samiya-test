'use client';

import { useState } from 'react';
import { toast } from 'hooks/ui/use-toast';
import { useRouter } from 'next/navigation';
import WishlistGrid from './WishlistGrid';
import EmptyWishlist from './EmptyWishlist';
import { apiRequest } from 'utils/apiRequest';
import { WishlistWithProduct } from 'types/wishlist';

interface WishlistClientProps {
  wishlists: WishlistWithProduct[] | null;
}

const WishlistClient = ({ wishlists }: WishlistClientProps) => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistWithProduct[]>(wishlists || []);
  const [loading, setLoading] = useState(false);

  const removeFromWishlist = async (itemId: string) => {
    const item = wishlistItems.find(item => item.id === itemId);
    if (!item) return;

    setLoading(true);

    const { data, error } = await apiRequest('/api/user/wishlists', {
      method: 'DELETE',
      body: {
        wishlistId: item.id,
        colorId: item.color_id,
        sizeId: item.size_id,
      },
      successMessage: "Item has been removed from your wishlist",
      errorMessage: "Failed to remove item. Please try again.",
      showSuccessToast: true,
      showErrorToast: true,
      showLoadingBar: true,
    });

    if (!error || !data.error) setWishlistItems(prev => prev.filter(item => item.id !== itemId));

    setLoading(false);
  };

  const addToCart = (item: WishlistWithProduct) => {
    toast({
      title: "Added to cart",
      description: `${item.product.title} has been added to your cart`,
    });
  };

  const purchaseNow = (item: WishlistWithProduct) => {
    toast({
      title: "Redirecting to checkout",
      description: `Processing purchase for ${item.product.title}`,
    });
  };

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

        {wishlistItems.length === 0 ? (
          <EmptyWishlist onContinueShopping={() => router.push("/")} />
        ) : (
          <WishlistGrid
            items={wishlistItems}
            onRemove={removeFromWishlist}
            onAddToCart={addToCart}
            onPurchaseNow={purchaseNow}
          />
        )}

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

export default WishlistClient;
