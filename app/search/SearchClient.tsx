"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProducts, Product } from '@/data/products';
import SearchContent from 'components/search/SearchContent';
import { type ProductFilters } from 'hooks/useProductFilters';

interface Props {
  initialProducts: Product[];
  initialQuery: string;
  initialFilters: ProductFilters;
}

export default function SearchClient({ initialProducts, initialQuery, initialFilters }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update products when filters change
  useEffect(() => {
    const results = searchProducts(initialQuery, filters);
    setProducts(results);

    // Update URL with new filters
    const params = new URLSearchParams(searchParams);

    // Set query
    params.set('q', initialQuery);

    // Update filter parameters
    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category);
    } else {
      params.delete('category');
    }

    if (filters.minPrice !== undefined) {
      params.set('minPrice', filters.minPrice.toString());
    } else {
      params.delete('minPrice');
    }

    if (filters.maxPrice !== undefined) {
      params.set('maxPrice', filters.maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    if (filters.colors && filters.colors.length > 0) {
      params.set('colors', filters.colors.join(','));
    } else {
      params.delete('colors');
    }

    if (filters.tags && filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','));
    } else {
      params.delete('tags');
    }

    // Update URL without causing a page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [filters, initialQuery, router, searchParams]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  return (
    <SearchContent
      products={products}
      onFiltersChange={handleFiltersChange}
    />
  );
}
