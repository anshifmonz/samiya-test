import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { searchProducts, Product } from '@/data/products';
import Navigation from '@/components/shared/Navigation';
import SearchResultsHeader from '@/components/search/SearchResultsHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import SearchClient from './SearchClient';
import { type ProductFilters } from '@/hooks/useProductFilters';

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

// Server function to fetch search results
async function getSearchResults(query: string, filters: ProductFilters): Promise<Product[]> {
  // Simulate API call delay (remove this in real implementation)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return searchProducts(query, filters);
}

// Parse search filters from URL parameters
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
  
  // Redirect to home if no search query
  if (query.trim() === '') {
    redirect('/');
  }
  
  const filters = parseFilters(searchParams);
  const products = await getSearchResults(query, filters);

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

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
