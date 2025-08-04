'use client';

import WishlistCard from './WishlistCard';
import { WishlistItem } from 'types/wishlist';

interface WishlistGridProps {
  items: WishlistItem[];
  onRemove: (itemId: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  onPurchaseNow: (item: WishlistItem) => void;
}

const WishlistGrid = ({ items, onRemove, onAddToCart, onPurchaseNow }: WishlistGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <WishlistCard
          key={item.id}
          item={item}
          onRemove={onRemove}
          onAddToCart={onAddToCart}
          onPurchaseNow={onPurchaseNow}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;
