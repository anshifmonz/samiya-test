'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from 'utils/apiRequest';
import { WishlistWithProduct } from 'types/wishlist';

export const useWishlist = (initialWishlists: WishlistWithProduct[] | null) => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistWithProduct[]>(initialWishlists || []);
  const [loading, setLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const removeFromWishlist = async (itemId: string) => {
    const item = wishlistItems.find(item => item.id === itemId);
    if (!item) return;

    setLoading(true);

    const { data, error } = await apiRequest('/api/user/wishlists', {
      method: 'DELETE',
      body: {
        wishlistId: item.id,
        colorId: item.color_id,
        sizeId: item.size_id
      },
      successMessage: 'Item has been removed from your wishlist',
      errorMessage: 'Failed to remove item. Please try again.',
      showSuccessToast: true,
      showErrorToast: true,
      showLoadingBar: true
    });

    if (!error || !data.error) {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    }

    setLoading(false);
  };

  const addToCart = async (item: WishlistWithProduct) => {
    if (!item.color_id || !item.size_id || !item.product_id) return;
    setIsAddingToCart(true);

    const colorId = item.color_id;
    const sizeId = item.size_id;

    await apiRequest('/api/user/cart', {
      method: 'POST',
      body: {
        productId: item.product_id,
        colorId,
        sizeId,
        quantity: 1
      },
      successMessage: 'Item added to cart successfully!',
      errorMessage: 'Failed to add item to cart',
      showSuccessToast: true,
      showErrorToast: true,
      showLoadingBar: true
    });
    setIsAddingToCart(false);
  };

  const purchaseNow = async (item: WishlistWithProduct) => {
    if (!item.color_id || !item.size_id || !item.product_id) return;

    const colorId = item.color_id;
    const sizeId = item.size_id;

    const { data, error } = await apiRequest('/api/user/checkout/direct', {
      method: 'POST',
      body: {
        productId: item.product_id,
        colorId,
        sizeId,
        quantity: 1
      },
      showLoadingBar: true,
      showErrorToast: true,
      errorMessage: 'Failed to purchase product'
    });
    if (!error && !data?.error && data?.success) router.push('/user/checkout/');
  };

  const onContinueShopping = () => router.push('/');

  return {
    loading,
    wishlistItems,
    isAddingToCart,

    addToCart,
    purchaseNow,
    removeFromWishlist,
    onContinueShopping
  };
};
