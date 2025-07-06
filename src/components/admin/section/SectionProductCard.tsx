import React from 'react';
import { X } from 'lucide-react';
import { type SectionProductItem } from '@/types/section';
import { Button } from 'components/ui/button';
import Productcard from 'components/home/shared/ProductCard';

interface SectionProductCardProps {
  product: SectionProductItem;
  onRemove: () => void;
}

const SectionProductCard: React.FC<SectionProductCardProps> = ({ product, onRemove }) => {
  const transformedProduct = {
    ...product,
    images: [product.images]
  };

  return (
    <div className="relative group">
      <Button
        onClick={onRemove}
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 z-50 bg-white/95 hover:bg-red-50 text-red-500 hover:text-red-700 transition-all duration-200 rounded-full w-8 h-8 p-0 shadow-lg border border-red-200 hover:shadow-xl"
        aria-label={`Remove ${product.title} from section`}
        title={`Remove ${product.title}`}
      >
        <X size={14} />
      </Button>

      <div className="relative border border-luxury-gray/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <Productcard
          product={transformedProduct}
          className="pl-4 p-2"
          showDiscountBadge={false}
        />
      </div>
    </div>
  );
};

export default SectionProductCard;
