import React from 'react';
import ProductCard from '../shared/ProductCard';
import { Product } from '@/data/products';

interface SimilarProductsProps {
  similarProducts: Product[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ similarProducts }) => {
  if (!similarProducts.length) return null;
  return (
    <div className="mt-16">
      <h2 className="luxury-heading text-3xl text-luxury-black mb-8 text-center">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
