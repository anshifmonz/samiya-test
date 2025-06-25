import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../shared/ProductCard';
import { products } from '../../data/products';

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="bg-luxury-beige py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
              <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                Handpicked Favorites
              </span>
              Featured Collection
            </h2>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              Discover our latest arrivals, showcasing the finest in traditional and contemporary fashion
            </p>
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

        <div className="text-center mt-24">
          <button
            onClick={() => navigate('/search?q=')}
            className="luxury-btn-primary px-20 py-6 rounded-full font-medium text-lg tracking-wider uppercase shadow-2xl"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
