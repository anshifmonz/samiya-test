"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { type Product } from 'types/product';
import ProductCard from '../shared/ProductCard';
import SearchResultsHeader from './SearchResultsHeader';

interface ProductsGridProps {
  products: Product[];
  query?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  const router = useRouter();

  return (
    <div className="flex-1 px-6 pb-6 pt-6 lg:p-6">
      {products.length > 0 ? (
        <>
          <SearchResultsHeader productCount={products.length} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  page === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-muted-foreground/30 text-6xl md:text-8xl mb-6">🔍</div>
          <h3 className="text-2xl md:text-3xl text-foreground mb-4">
            No products found
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Try adjusting your search terms or filters to discover more products
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-primary-foreground px-8 md:px-12 py-4 md:py-6 rounded-lg text-base md:text-lg tracking-wider uppercase shadow-lg hover:bg-primary-hover transition-colors"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
