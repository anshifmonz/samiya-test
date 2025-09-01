'use client';

import WishlistCard from './WishlistCard';
import { useWishlistContext } from 'contexts/user/WishlistContext';

const WishlistGrid = () => {
  const { wishlistItems } = useWishlistContext();
  return (
    <div className="flex flex-col gap-4">
      {wishlistItems.map(item => (
        <WishlistCard key={item.product_id} item={item} />
      ))}
    </div>
  );
};

export default WishlistGrid;
