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
    <div className="lg:w-3/4">
      {products.length > 0 ? (
        <div className="animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="text-center py-24 animate-fade-in-up">
          <div className="text-luxury-gold/30 text-8xl mb-8">🔍</div>
          <h3 className="luxury-heading text-3xl text-luxury-black mb-6">
            No products found
          </h3>
          <p className="luxury-body text-xl text-luxury-gray mb-12 max-w-2xl mx-auto leading-relaxed">
            Try adjusting your search terms or filters to discover our exquisite collection
          </p>
          <button
            onClick={() => navigate('/')}
            className="luxury-btn-primary px-12 py-6 rounded-full text-lg tracking-wider uppercase shadow-2xl"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
