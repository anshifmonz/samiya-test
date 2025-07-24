'use client';

import ProductCard from '../shared/ProductCard';
import SearchResultsHeader from './SearchResultsHeader';
import { useInfiniteProductScroll } from 'hooks/search/useInfiniteProductScroll';
import { useSearchContext } from 'contexts/SearchContext';

const ProductsGrid: React.FC = () => {
  const { products: initialProducts, totalCount: initialTotalCount, initialQuery: query, filters, onFiltersChange } = useSearchContext();
  const { products, totalCount, loading, hasMore, loaderRef } = useInfiniteProductScroll(initialProducts, initialTotalCount, query, filters);
  return (
    <div className="flex-1 px-4 sm:px-6 py-6 lg:p-6">
      {products.length > 0 ? (
        <>
          <SearchResultsHeader productCount={products.length} totalCount={totalCount} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div ref={loaderRef} className="flex justify-center mt-8 min-h-[40px]">
            {loading && (
              <span className="text-muted-foreground text-lg">Loading...</span>
            )}
            {!hasMore && (
              <span className="text-muted-foreground text-lg">No more products</span>
            )}
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
            onClick={() => onFiltersChange({})}
            className="bg-primary text-primary-foreground px-4 md:px-6 py-4 md:py-4 rounded-lg text-base md:text-lg tracking-wider uppercase shadow-lg hover:bg-primary-hover transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
