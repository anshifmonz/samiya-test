import { type Product } from 'types/product';

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-foreground">{product.title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{product.short_code}</p>
    </div>
  );
}
