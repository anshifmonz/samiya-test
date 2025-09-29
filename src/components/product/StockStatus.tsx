import { useProductContext } from 'contexts/ProductContext';

const LowStock = ({ stock_quantity }: { stock_quantity: number }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
      <span className="text-sm font-medium text-orange-600">Low stock - {stock_quantity} left</span>
    </div>
  );
};

const OutOfStock = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <span className="text-sm font-medium text-red-600">Out of stock</span>
    </div>
  );
};

const InStock = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm font-medium text-green-600">In stock</span>
    </div>
  );
};

export default function StockStatus() {
  const { selectedSizeData: selectedSize } = useProductContext();
  if (!selectedSize || selectedSize.stock_quantity === undefined) return <OutOfStock />;

  const { stock_quantity, is_in_stock, is_low_stock } = selectedSize;
  if (!is_in_stock) return <OutOfStock />;
  if (is_low_stock) return <LowStock stock_quantity={stock_quantity} />;
  return <InStock />;
}
