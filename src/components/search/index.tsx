import React, { Suspense } from 'react';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import SearchPage from './SearchPage';
import { Product, type ProductFilters } from 'types/product';
import { type Category } from 'types/category';

interface Props {
  initialProducts: Omit<Product, 'description'>[];
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
}

export default async function Search({ initialProducts, initialQuery, initialFilters, initialCategories }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pl-6">
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
