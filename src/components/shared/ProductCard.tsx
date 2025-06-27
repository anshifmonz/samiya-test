
import React from 'react';
import { Product } from '../../data/products';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const firstImage = Object.values(product.images)[0]?.[0]; // Get first image from first color

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="luxury-card rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 border border-luxury-gray/10 hover:border-luxury-gold/30 bg-white/95 backdrop-blur-md"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={firstImage}
          alt={product.title}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-6 left-6 glass rounded-full px-4 py-2">
          <span className="luxury-subheading text-xs text-white font-light tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <span className="luxury-body text-white/90 text-sm">
                View Details
              </span>
              <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-luxury-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="luxury-heading text-xl text-luxury-black mb-4 line-clamp-2 group-hover:text-luxury-gold transition-colors duration-300">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-6">
          <span className="luxury-heading text-2xl text-luxury-gold">
            ₹{product.price.toLocaleString()}
          </span>

          {/* Color Swatches */}
          <div className="flex gap-2">
            {Object.keys(product.images).slice(0, 4).map(color => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-luxury-gray/20"
                style={{
                  backgroundColor: color === 'cream' ? '#F5F5DC' :
                                 color === 'navy' ? '#000080' :
                                 color === 'red' ? '#DC2626' :
                                 color === 'green' ? '#059669' :
                                 color === 'blue' ? '#2563EB' :
                                 color === 'purple' ? '#7C3AED' :
                                 color === 'pink' ? '#EC4899' :
                                 color === 'yellow' ? '#EAB308' :
                                 color === 'orange' ? '#EA580C' :
                                 color === 'brown' ? '#92400E' :
                                 color === 'gray' ? '#6B7280' :
                                 color === 'black' ? '#000000' :
                                 color === 'white' ? '#FFFFFF' : color
                }}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
