import { useProductContext } from 'contexts/ProductContext';

export default function ProductPricing() {
  const { product } = useProductContext();
  return (
    <>
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-xl line-through text-muted-foreground">₹{product.originalPrice.toLocaleString()}</span>
        )}
      </div>
    </>
  );
}
