import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type SectionWithProducts, type SectionProductItem } from 'types/section';
import CarouselWrapper from 'components/home/shared/CarouselWrapper';
import DraggableProductItem from './DraggableProductItem';

interface ProductsCarouselProps {
  section: SectionWithProducts;
  sectionProducts: SectionProductItem[];
  onDragEnd: (event: any, section: SectionWithProducts) => void;
  onRemoveProduct: (sectionId: string, productId: string) => void;
}

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({
  section,
  sectionProducts,
  onDragEnd,
  onRemoveProduct
}) => {
  const productSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (sectionProducts.length === 0) {
    return (
      <div className="text-center py-8 text-luxury-gray">
        <p className="luxury-body text-sm">No products in this section yet.</p>
        <p className="luxury-body text-xs mt-1">Click "Add Product" to get started.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={productSensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => onDragEnd(event, section)}
    >
      <SortableContext
        items={sectionProducts.map(product => product.id)}
        strategy={horizontalListSortingStrategy}
      >
        <CarouselWrapper className="w-full">
          {sectionProducts.map((product) => (
            <DraggableProductItem
              key={product.id}
              product={product}
              onRemove={() => onRemoveProduct(section.id, product.id)}
            />
          ))}
        </CarouselWrapper>
      </SortableContext>
    </DndContext>
  );
};

export default ProductsCarousel;
