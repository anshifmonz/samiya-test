import { Button } from 'ui/button';

interface ProductActionsProps {
  onBuyNow: () => void;
}

export default function ProductActions({ onBuyNow }: ProductActionsProps) {
  return (
    <div className="space-y-3">
      <Button
        className="w-full py-3 text-base font-medium bg-luxury-gold text-black hover:bg-luxury-black/90"
        onClick={onBuyNow}
      >
        Buy it now
      </Button>
    </div>
  );
}
