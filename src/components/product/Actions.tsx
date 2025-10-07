import { Button } from 'ui/button';
import { ShoppingCart, Loader2, Zap } from 'lucide-react';
import { useAuthContext } from 'contexts/AuthContext';
import { useProductContext } from 'contexts/ProductContext';
import { useAuthModal } from 'contexts/user/shared/AuthModalContext';

export default function ProductActions() {
  const {
    selectedSize,
    selectedColor,
    selectedSizeData,
    handlePurchase: originalHandlePurchase,
    handleAddToCart: originalHandleAddToCart,
    isAddingToCart,
    isPurchasing
  } = useProductContext();

  const { user } = useAuthContext();
  const { setAuthModalOpen, setOnSigninSuccess } = useAuthModal();

  const isOutOfStock = selectedSizeData?.stock_quantity === 0;
  const canAddToCart = selectedColor && selectedSize && selectedSizeData && !isOutOfStock;

  const authenticateUser = (fn: () => void): void => {
    setOnSigninSuccess(fn);
    setAuthModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!user) return authenticateUser(originalHandleAddToCart);
    originalHandleAddToCart();
  };

  const handlePurchase = () => {
    if (!user) return authenticateUser(originalHandlePurchase);
    originalHandlePurchase();
  };

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
        onClick={handlePurchase}
        disabled={!canAddToCart || isPurchasing}
      >
        {isPurchasing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Purchasing...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Purchase now
          </>
        )}
      </Button>
    </div>
  );
}
