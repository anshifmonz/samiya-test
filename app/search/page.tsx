import React from 'react';
import { redirect } from 'next/navigation';
import searchProducts from 'lib/public/search';
import getCategories from 'lib/public/category';
import Search from 'components/search';
import { type Product, type ProductFilters } from 'types/product';
import { type Category } from 'types/category';

export const revalidate = 180;

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    tags?: string;
    source?: string;
  };
}

// parse search filters from url parameters
function parseFilters(searchParams: Props['searchParams']): ProductFilters {
  const filters: ProductFilters = {};

  if (searchParams.category)
    filters.category = searchParams.category;

  if (searchParams.minPrice) {
    const minPrice = parseFloat(searchParams.minPrice);
    if (!isNaN(minPrice)) filters.minPrice = minPrice;
  }

  if (searchParams.maxPrice) {
    const maxPrice = parseFloat(searchParams.maxPrice);
    if (!isNaN(maxPrice)) filters.maxPrice = maxPrice;
  }

  if (searchParams.colors)
    filters.colors = searchParams.colors.split(',').filter(Boolean);

  if (searchParams.tags)
    filters.tags = searchParams.tags.split(',').filter(Boolean);

  return filters;
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const source = searchParams.source;

  if (
    ((!query || query.trim() === '') && source !== 'budget') ||
    (source === 'budget' && minPrice == null && maxPrice == null)
  ) {
    redirect('/');
  }

  const filters = parseFilters(searchParams);
  const products: Omit<Product, 'description'>[] = await searchProducts(query, filters);
  const categories: Category[] = await getCategories();

  return (
    <Search
      initialProducts={products}
      initialQuery={query}
      initialFilters={filters}
      initialCategories={categories}
      source={source}
    />
  );
}
