import { type Product } from 'types/product';

interface ProductPricingProps {
  product: Product;
}

export default function ProductPricing({ product }: ProductPricingProps) {
  return (
    <>
      <div className="flex items-center space-x-3">
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-xl line-through text-muted-foreground">₹{product.originalPrice.toLocaleString()}</span>
        )}
        <span className="text-3xl font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
      </div>
      <p className="text-sm text-muted-foreground -mt-2 mb-4">
        Taxes included.
      </p>
    </>
  );
}
