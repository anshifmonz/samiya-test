import React from 'react';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CarouselItem } from 'components/ui/carousel';
import { type SectionProductItem } from 'types/section';
import SectionProductCard from '../SectionProductCard';

interface DraggableProductItemProps {
  product: SectionProductItem;
  onRemove: () => void;
}

const DraggableProductItem: React.FC<DraggableProductItemProps> = ({
  product,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const,
  };

  return (
    <CarouselItem className="flex-none pl-2">
      <div
        ref={setNodeRef}
        style={style}
        className={`relative ${isDragging ? 'shadow-lg' : ''}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-50 bg-white/95 hover:bg-luxury-gray/10 text-luxury-gray hover:text-luxury-black transition-all duration-200 rounded-full w-8 h-8 p-0 shadow-lg border border-luxury-gray/200 hover:shadow-xl flex items-center justify-center"
          title="Drag to reorder"
          type="button"
        >
          <GripVertical size={14} />
        </button>
        <SectionProductCard
          product={product}
          onRemove={onRemove}
        />
      </div>
    </CarouselItem>
  );
};

export default DraggableProductItem;
