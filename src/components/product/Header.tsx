import { useProductContext } from 'contexts/ProductContext';

export default function ProductHeader() {
  const { product } = useProductContext();
  return (
    <div>
      <h1 className="text-3xl font-semibold text-foreground">{product.title} <span className="text-muted-foreground text-sm">{product.short_code}</span></h1>
      <p className="text-lg text-gray-600 mt-1">{product.description}</p>
    </div>
  );
}
