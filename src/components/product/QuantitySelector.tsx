import { Minus, Plus } from 'lucide-react';
import { useToast } from 'hooks/ui/use-toast';
import { useProductContext } from 'contexts/ProductContext';

export default function QuantitySelector() {
  const { isArchive, quantity, setQuantity, selectedSizeData } = useProductContext();
  const stock = selectedSizeData?.stock_quantity;
  const { toast } = useToast();

  const handleIncrease = () => {
    if (stock !== undefined && quantity >= stock) {
      toast({
        variant: 'default',
        title: 'Oops! Limited Stock',
        description: `Only ${stock} item${stock !== 1 ? 's' : ''} ${stock === 1 ? 'is' : 'are'} currently in stock.`
      });
    } else {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Quantity</span>
      <div
        className={`flex items-center border border-border rounded w-fit ${
          isArchive ? 'opacity-50' : ''
        }`}
      >
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2 hover:bg-muted"
          disabled={isArchive}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
        <button onClick={handleIncrease} className="p-2 hover:bg-muted" disabled={isArchive}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
