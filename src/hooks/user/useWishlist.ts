'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'hooks/ui/use-toast';
import { apiRequest } from 'utils/apiRequest';
import { WishlistWithProduct } from 'types/wishlist';

export const useWishlist = (initialWishlists: WishlistWithProduct[] | null) => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistWithProduct[]>(initialWishlists || []);
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

    if (!error || !data.error) {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    }

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
    // router.push('/user/checkout');
  };

  const onContinueShopping = () => {
    router.push('/');
  };

  return {
    wishlistItems,
    loading,
    removeFromWishlist,
    addToCart,
    purchaseNow,
    onContinueShopping,
  };
};
