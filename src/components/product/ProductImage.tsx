import React from 'react';
import { Product } from '@/data/products';

interface ProductImageProps {
  product: Product;
  currentImage: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, currentImage }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-luxury-beige shadow-lg">
        <img
          src={currentImage}
          alt={product.title}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default ProductImage;
