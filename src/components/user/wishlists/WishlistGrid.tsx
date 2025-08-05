'use client';

import WishlistCard from './WishlistCard';
import { WishlistWithProduct } from 'types/wishlist';

interface WishlistGridProps {
  items: WishlistWithProduct[];
  onRemove: (itemId: string) => void;
  onAddToCart: (item: WishlistWithProduct) => void;
  onPurchaseNow: (item: WishlistWithProduct) => void;
}

const WishlistGrid = ({ items, onRemove, onAddToCart, onPurchaseNow }: WishlistGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <WishlistCard
          key={item.product_id}
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
