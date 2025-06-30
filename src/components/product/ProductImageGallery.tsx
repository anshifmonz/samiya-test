import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductImageGalleryProps {
  product: Product;
  selectedColor: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product, selectedColor }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImages = product.images[selectedColor] || [];

  // Reset to first image when color changes
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

  if (!currentImages.length) {
    return (
      <div className="flex flex-col items-center">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-luxury-beige shadow-lg flex items-center justify-center">
          <span className="text-luxury-gray">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnail Gallery - Vertical on desktop, horizontal on mobile */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-96 lg:w-20">
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
            <img
              src={image}
              alt={`${product.title} ${selectedColor} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Navigation */}
      <div className="order-1 lg:order-2 flex-1 relative">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-luxury-beige shadow-lg relative group">
          <img
            src={currentImages[currentImageIndex]}
            alt={`${product.title} ${selectedColor}`}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Navigation Arrows - Only show if multiple images */}
          {currentImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-luxury-black" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-luxury-black" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {currentImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          )}
        </div>

        {/* Mobile Navigation Dots */}
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
