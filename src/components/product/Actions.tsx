import { Button } from 'ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useProductContext } from 'contexts/ProductContext';

export default function ProductActions() {
  const {
    selectedColor,
    selectedSize,
    selectedSizeData,
    handleWhatsApp,
    handleAddToCart,
    isAddingToCart
  } = useProductContext();

  const isOutOfStock = selectedSizeData?.stock_quantity === 0;
  const canAddToCart = selectedColor && selectedSize && selectedSizeData && !isOutOfStock;

  return (
    <div className="space-y-3">
      <Button
        className="w-full py-3 text-base font-medium"
        onClick={handleAddToCart}
        disabled={!canAddToCart || isAddingToCart}
        variant="outline"
      >
        {isAddingToCart ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>

      <Button
        className="w-full py-3 text-base font-medium bg-luxury-gold text-black hover:bg-luxury-black/90"
        onClick={handleWhatsApp}
        disabled={!canAddToCart}
      >
        Buy it now
      </Button>
    </div>
  );
}
