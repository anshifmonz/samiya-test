import React from 'react';
import ProductCard from '../shared/ProductCard';
import { products } from '@/data/products';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="bg-luxury-cream py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-2xl sm:text-3xl text-luxury-black mb-8">
              Featured Collection
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
