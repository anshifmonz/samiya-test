import { Button } from 'ui/button';

import { useProductContext } from 'contexts/ProductContext';

export default function ProductActions() {
  const { handleWhatsApp } = useProductContext();
  return (
    <div className="space-y-3">
      <Button
        className="w-full py-3 text-base font-medium bg-luxury-gold text-black hover:bg-luxury-black/90"
        onClick={handleWhatsApp}
      >
        Buy it now
      </Button>
    </div>
  );
}
