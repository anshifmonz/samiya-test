'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'hooks/ui/use-toast';
import WishlistGrid from './WishlistGrid';
import EmptyWishlist from './EmptyWishlist';
import { WishlistItem } from 'types/wishlist';

const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    description: "High-quality noise-cancelling wireless headphones with premium sound",
    price: 199.99,
    originalPrice: 299.99,
    image: "/placeholder.svg",
    selectedSize: "One Size",
    selectedColor: "Matte Black"
  },
  {
    id: "2",
    title: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    price: 149.99,
    originalPrice: 249.99,
    image: "/placeholder.svg",
    selectedSize: "42mm",
    selectedColor: "Space Gray"
  },
  {
    id: "3",
    title: "Designer Backpack",
    description: "Stylish and functional backpack perfect for daily use",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg",
    selectedSize: "Medium",
    selectedColor: "Navy Blue"
  }
];

const Wishlist = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist",
    });
  };

  const addToCart = (item: WishlistItem) => {
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart`,
    });
  };

  const purchaseNow = (item: WishlistItem) => {
    toast({
      title: "Redirecting to checkout",
      description: `Processing purchase for ${item.title}`,
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
      </div>
    </div>
  );
};

export default Wishlist;
