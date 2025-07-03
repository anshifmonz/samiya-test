import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import searchProducts from '@/lib/public/product';
import SearchResultsHeader from 'components/search/SearchResultsHeader';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import SearchClient from './SearchClient';
import { type ProductFilters } from '@/types/product';

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    tags?: string;
  };
}

// parse search filters from url parameters
function parseFilters(searchParams: Props['searchParams']): ProductFilters {
  const filters: ProductFilters = {};

  if (searchParams.category) {
    filters.category = searchParams.category;
  }

  if (searchParams.minPrice) {
    const minPrice = parseFloat(searchParams.minPrice);
    if (!isNaN(minPrice)) {
      filters.minPrice = minPrice;
    }
  }

  if (searchParams.maxPrice) {
    const maxPrice = parseFloat(searchParams.maxPrice);
    if (!isNaN(maxPrice)) {
      filters.maxPrice = maxPrice;
    }
  }

  if (searchParams.colors) {
    filters.colors = searchParams.colors.split(',').filter(Boolean);
  }

  if (searchParams.tags) {
    filters.tags = searchParams.tags.split(',').filter(Boolean);
  }

  return filters;
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';

  if (query.trim() === '') redirect('/');

  const filters = parseFilters(searchParams);
  const products = await searchProducts(query, filters);

  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <SearchResultsHeader query={query} productCount={products.length} />
        <Suspense fallback={<LoadingSpinner text="Loading search results..." />}>
          <SearchClient
            initialProducts={products}
            initialQuery={query}
            initialFilters={filters}
          />
        </Suspense>
      </div>
    </div>
  );
}
