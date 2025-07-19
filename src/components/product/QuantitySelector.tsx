import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Quantity</span>
      <div className="flex items-center border border-border rounded w-fit">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="p-2 hover:bg-muted"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="p-2 hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
