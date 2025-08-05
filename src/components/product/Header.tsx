import { useProductContext } from 'contexts/ProductContext';
import { Heart } from 'lucide-react';

export default function ProductHeader() {
  const { product, isWishlist, isLoadingWishlist, handleWishlistToggle } = useProductContext();

  return (
    <div className="">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-semibold text-foreground">{product.title} <span className="text-muted-foreground text-sm">{product.short_code}</span></h1>
        <Heart
          className={`transition-colors ${
            isWishlist
            ? 'text-pink-500 fill-pink-500'
            : 'text-gray-400 hover:text-pink-400'
          } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleWishlistToggle}
        />
      </div>
      <p className="text-lg text-gray-600">{product.description}</p>
    </div>
  );
}
