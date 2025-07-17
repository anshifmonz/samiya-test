'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import isCloudinaryUrl from 'utils/isCloudinaryUrls';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Product } from 'types/product';

interface ProductImageGalleryProps {
  product: Product;
  selectedColor: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product, selectedColor }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const currentImages = (product.images[selectedColor]?.images || []).map(img =>
    typeof img === 'string' ? img : img.url
  );

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  const goToPrevious = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(prev =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentImages.length <= 1) return;

    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
    setDragOffsetX(0);

    if (mainImageRef.current) {
      mainImageRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || currentImages.length <= 1) return;

    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffsetX(deltaX);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || currentImages.length <= 1) return;

    setIsDragging(false);

    if (mainImageRef.current) {
      mainImageRef.current.style.cursor = 'grab';
    }

    const threshold = 30;
    if (Math.abs(dragOffsetX) > threshold) {
      if (dragOffsetX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    setDragOffsetX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentImages.length <= 1) return;

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStartX(touch.clientX);
    setDragStartY(touch.clientY);
    setDragOffsetX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || currentImages.length <= 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    const deltaY = touch.clientY - dragStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffsetX(deltaX);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || currentImages.length <= 1) return;

    setIsDragging(false);

    const threshold = 30;
    if (Math.abs(dragOffsetX) > threshold) {
      if (dragOffsetX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    setDragOffsetX(0);
  };

  if (!currentImages.length) {
    return (
      <div className="flex flex-col items-center">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] lg:w-20 scrollbar-hide">
        {currentImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              currentImageIndex === index
                ? 'border-luxury-gold ring-2 ring-luxury-gold/30'
                : 'border-luxury-gray/20 hover:border-luxury-gold/50'
            }`}
          >
            {isCloudinaryUrl(image) ? (
              <CldImage
                src={image}
                alt={`${product.title} - ${selectedColor} (Thumbnail ${index + 1})`}
                width={80}
                height={80}
                sizes="(max-width: 600px) 20vw, 80px"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={image}
                alt={`${product.title} ${selectedColor} view ${index + 1}`}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            )}
          </button>
        ))}
      </div>

      <div className="order-1 lg:order-2 flex-1 relative">
        <div
          ref={mainImageRef}
          className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted relative group cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isDragging ? `translateX(${dragOffsetX * 0.15}px)` : 'translateX(0)',
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {isCloudinaryUrl(currentImages[currentImageIndex]) ? (
            <CldImage
              src={currentImages[currentImageIndex]}
              alt={`${product.title} - ${selectedColor} (Main view)`}
              width={600}
              height={750}
              sizes="(max-width: 900px) 100vw, 600px"
              className="w-full h-full object-cover transition-all duration-300"
              priority={currentImageIndex === 0}
            />
          ) : (
            <Image
              src={currentImages[currentImageIndex]}
              alt={`${product.title} ${selectedColor}`}
              className="w-full h-full object-cover transition-all duration-300"
              width={600}
              height={750}
              priority={currentImageIndex === 0}
              draggable={false}
            />
          )}

          {currentImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-luxury-black" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-luxury-black" />
              </button>
            </>
          )}

          {currentImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          )}
        </div>

        {currentImages.length > 1 && (
          <div className="flex justify-center mt-4 gap-2 lg:hidden">
            {currentImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentImageIndex === index
                    ? 'bg-luxury-gold'
                    : 'bg-luxury-gray/30 hover:bg-luxury-gold/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
