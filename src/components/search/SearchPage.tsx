"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import searchProducts from '@/lib/public/product';
import SearchContent from './SearchContent';
import { type Product, type ProductFilters } from '@/types/product';
import { type Category } from '@/types/category';

interface Props {
  initialProducts: Product[];
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
}

export default function SearchPage({ initialProducts, initialQuery, initialFilters, initialCategories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const router = useRouter();
  const isFirstRun = useRef(true);

  // fetch products when filters or query change and not on first run
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const fetchProducts = async () => {
      const results = await searchProducts(initialQuery, filters);
      setProducts(results);
    };
    fetchProducts();
  }, [filters, initialQuery]);

  // sync url with current filters and query
  useEffect(() => {
    const params = new URLSearchParams();

    params.set('q', initialQuery);

    if (filters.category && filters.category !== 'all')
      params.set('category', filters.category);

    if (filters.minPrice !== undefined)
      params.set('minPrice', filters.minPrice.toString());

    if (filters.maxPrice !== undefined)
      params.set('maxPrice', filters.maxPrice.toString());

    if (filters.colors && filters.colors.length > 0)
      params.set('colors', filters.colors.join(','));

    if (filters.tags && filters.tags.length > 0)
      params.set('tags', filters.tags.join(','));

    const newUrl = `${window.location.pathname}?${params.toString()}`;

    if (newUrl !== window.location.href)
      router.replace(newUrl, { scroll: false });
  }, [filters, initialQuery, router]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  return (
    <SearchContent
      products={products}
      onFiltersChange={handleFiltersChange}
      categories={initialCategories}
    />
  );
}
