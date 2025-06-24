
import React from 'react';
import { Product } from '../data/products';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const firstImage = Object.values(product.images)[0];

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-rose-100 hover:border-rose-200"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={firstImage}
          alt={product.title}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-bold text-rose-600 shadow-lg">
          {product.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 tracking-tight group-hover:text-rose-700 transition-colors duration-300">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-rose-600">
            ₹{product.price}
          </span>
          <div className="flex gap-2">
            {Object.keys(product.images).slice(0, 3).map(color => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color === 'cream' ? '#F5F5DC' : color === 'navy' ? '#000080' : color }}
                title={color}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-full font-medium border border-rose-100"
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
