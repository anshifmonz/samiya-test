'use client';

import Image from 'next/image';
import { type Product } from 'types/product';

interface ProductImageProps {
  product: Product;
  currentImage: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, currentImage }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-luxury-beige shadow-lg">
        <Image
          src={currentImage}
          alt={product.title}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          width={600}
          height={600}
          priority
        />
      </div>
    </div>
  );
};

export default ProductImage;
