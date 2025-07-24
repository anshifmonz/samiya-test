import React, { Suspense } from 'react';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import SearchPage from './SearchPage';
import { type SearchProduct, type ProductFilters } from 'types/product';
import { type Category } from 'types/category';

interface Props {
  initialProducts: SearchProduct[];
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
  source?: string;
}

export default async function Search({ initialProducts, initialQuery, initialFilters, initialCategories, source }: Props) {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background">
      <div className="pt-16">
        <Suspense fallback={<LoadingSpinner text="Loading search results..." />}>
          <SearchPage
            initialProducts={initialProducts}
            initialQuery={initialQuery}
            initialFilters={initialFilters}
            initialCategories={initialCategories}
            source={source}
          />
        </Suspense>
      </div>
    </div>
  );
}
