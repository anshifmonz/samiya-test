
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../data/products';
import ProductCard from '../shared/ProductCard';

interface ProductsGridProps {
  products: Product[];
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-w-0">
      {products.length > 0 ? (
        <div className="animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="text-luxury-gold/30 text-6xl md:text-8xl mb-6">🔍</div>
          <h3 className="luxury-heading text-2xl md:text-3xl text-luxury-black mb-4">
            No products found
          </h3>
          <p className="luxury-body text-lg md:text-xl text-luxury-gray mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Try adjusting your search terms or filters to discover our exquisite collection
          </p>
          <button
            onClick={() => navigate('/')}
            className="luxury-btn-primary px-8 md:px-12 py-4 md:py-6 rounded-full text-base md:text-lg tracking-wider uppercase shadow-2xl"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
