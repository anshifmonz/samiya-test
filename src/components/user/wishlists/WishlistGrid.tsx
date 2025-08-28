'use client';

import WishlistCard from './WishlistCard';
import { useWishlistContext } from 'contexts/user/WishlistContext';

const WishlistGrid = () => {
  const { wishlistItems } = useWishlistContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map(item => (
        <WishlistCard key={item.product_id} item={item} />
      ))}
    </div>
  );
};

export default WishlistGrid;
