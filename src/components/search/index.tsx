import React, { Suspense } from 'react';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import SearchPage from './SearchPage';
import { SearchProduct, type ProductFilters } from 'types/product';
import { type Category } from 'types/category';
import { ProductResultsProvider } from 'contexts/ProductResultsContext';
import { SearchFiltersProvider } from 'contexts/SearchFiltersContext';

interface Props {
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
  source?: string;
}

export default async function Search({ initialProducts, initialTotalCount, initialQuery, initialFilters, initialCategories, source }: Props) {
  return (
    <ProductResultsProvider
      initialProducts={initialProducts}
      initialTotalCount={initialTotalCount}
      initialCategories={initialCategories}
    >
      <SearchFiltersProvider
        initialFilters={initialFilters}
        initialQuery={initialQuery}
        source={source}
      >
        <div className="min-h-screen max-w-7xl mx-auto bg-background">
          <div className="pt-16">
            <Suspense fallback={<LoadingSpinner text="Loading search results..." />}>
              <SearchPage />
            </Suspense>
          </div>
        </div>
      </SearchFiltersProvider>
    </ProductResultsProvider>
  );
}
