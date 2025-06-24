
import React from 'react';
import { Product } from '../data/products';
import { useRouter } from 'next/router';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const firstImage = Object.values(product.images)[0];

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={firstImage}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{product.price}
          </span>
          <div className="flex gap-1">
            {Object.keys(product.images).slice(0, 3).map(color => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color === 'cream' ? '#F5F5DC' : color === 'navy' ? '#000080' : color }}
                title={color}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
