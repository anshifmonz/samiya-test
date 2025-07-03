import React, { Suspense } from 'react';
import SearchResultsHeader from 'components/search/SearchResultsHeader';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import SearchPage from './SearchPage';
import { Product, type ProductFilters } from '@/types/product';
import { type Category } from '@/types/category';

interface Props {
  initialProducts: Product[];
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
}

export default async function Search({ initialProducts, initialQuery, initialFilters, initialCategories }: Props) {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <SearchResultsHeader query={initialQuery} productCount={initialProducts.length} />
        <Suspense fallback={<LoadingSpinner text="Loading search results..." />}>
          <SearchPage
            initialProducts={initialProducts}
            initialQuery={initialQuery}
            initialFilters={initialFilters}
            initialCategories={initialCategories}
          />
        </Suspense>
      </div>
    </div>
  );
}
