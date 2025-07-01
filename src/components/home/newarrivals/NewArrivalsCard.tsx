import React from 'react';
import Image from 'next/image';
import { type Product } from '@/data/specials';

const NewArrivalsCard = ({ product }: { product: Product }) => {
  return (
    <div className="relative bg-card rounded-sm overflow-hidden shadow-sm group cursor-pointer">
      <div className="relative h-[350px] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={270}
          height={320}
        />
        <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
          10% OFF
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-cormorant font-medium text-gray-900 mb-2">{product.title}</h3>
        <p className="text-lg font-inter font-semibold text-gray-900">
          RS {product.price}
        </p>
      </div>
    </div>
  );
};

export default NewArrivalsCard;
