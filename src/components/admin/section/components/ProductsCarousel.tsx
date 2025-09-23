import { useRef, useState, useCallback, useEffect } from 'react';
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
import { type SectionWithProducts } from 'types/section';
import { useSectionsTab } from 'contexts/admin/SectionsTabContext';
import CarouselWrapper from 'components/home/shared/CarouselWrapper';
import DraggableProductItem from './DraggableProductItem';

function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

interface ProductsCarouselProps {
  section: SectionWithProducts;
}

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({ section }) => {
  const { handleRemoveProduct, handleProductDragEnd, getSectionProducts } = useSectionsTab();

  const sectionProducts = getSectionProducts(section);
  const [isDragging, setIsDragging] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const emblaApiRef = useRef<any>(null);
  const lastAutoScrollTimeRef = useRef(0);
  const savedIndexRef = useRef<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    if (!isDragging && emblaApiRef.current) {
      emblaApiRef.current.reInit();
    }
  }, [isDragging]);

  const handleSetApi = (api: any) => {
    emblaApiRef.current = api;
    if (api && savedIndexRef.current !== null) {
      api.scrollTo(savedIndexRef.current, true);
      savedIndexRef.current = null;
    }
  };

  const productSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isTouch
        ? { distance: 2, delay: 100, tolerance: 3 }
        : { distance: 3, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragMove = useCallback((event: any) => {
    if (!isDragging || !carouselContainerRef.current || !emblaApiRef.current) return;
    const pointerEvent = event.activatorEvent;
    if (!pointerEvent) return;
    let clientX;
    if (pointerEvent.touches && pointerEvent.touches.length > 0) {
      clientX = pointerEvent.touches[0].clientX;
    } else {
      clientX = pointerEvent.clientX;
    }
    const rect = carouselContainerRef.current.getBoundingClientRect();
    const edgeThreshold = 40;
    const now = Date.now();
    if (clientX - rect.left < edgeThreshold) {
      if (now - lastAutoScrollTimeRef.current > 200) {
        emblaApiRef.current.scrollPrev();
        lastAutoScrollTimeRef.current = now;
      }
    } else if (rect.right - clientX < edgeThreshold) {
      if (now - lastAutoScrollTimeRef.current > 200) {
        emblaApiRef.current.scrollNext();
        lastAutoScrollTimeRef.current = now;
      }
    }
  }, [isDragging]);

  if (sectionProducts.length === 0) {
    return (
      <div className="text-center py-8 text-luxury-gray">
        <p className="luxury-body text-sm">No products in this section yet.</p>
        <p className="luxury-body text-xs mt-1">Click &quot;Add Product&quot; to get started.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={productSensors}
      collisionDetection={closestCenter}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event) => {
        setIsDragging(false);
        if (emblaApiRef.current) {
          savedIndexRef.current = emblaApiRef.current.selectedScrollSnap();
        }
        setCarouselKey(k => k + 1);
        handleProductDragEnd(event, section);
      }}
      onDragCancel={() => setIsDragging(false)}
      onDragMove={handleDragMove}
    >
      <SortableContext
        items={sectionProducts.map(product => product.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div ref={carouselContainerRef} className="w-full">
          <CarouselWrapper
            key={carouselKey}
            className="w-full"
            disableSwipe={isDragging}
            setApi={handleSetApi}
          >
            {sectionProducts.map((product) => (
              <DraggableProductItem
                key={product.id}
                product={product}
                onRemove={() => handleRemoveProduct(section.id, product.id, product.title, section.title)}
              />
            ))}
          </CarouselWrapper>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ProductsCarousel;
