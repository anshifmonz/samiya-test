import React from 'react';
import ProductCard from '../shared/ProductCard';
import { products } from '../../data/products';

// Server function to fetch featured products
async function getFeaturedProducts() {
  // Simulate API call delay (remove this in real implementation)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Get the first 6 products as featured
  return products.slice(0, 6);
}

const FeaturedProductsServer: React.FC = async () => {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-luxury-beige py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
              <span className="luxury-subheading block text-luxury-gold-dark text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
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
      </div>
    </div>
  );
};

export default FeaturedProductsServer;
