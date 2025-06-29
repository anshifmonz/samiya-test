"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchProducts, Product } from '@/data/products';
import Navigation from '@/components/shared/Navigation';
import SearchResultsHeader from '@/components/search/SearchResultsHeader';
import SearchContent from '@/components/search/SearchContent';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { type ProductFilters } from '@/hooks/useProductFilters';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    if (q.trim() === '') {
      router.replace('/');
      return;
    }
    setLoading(true);
    const results = searchProducts(q, filters);
    setProducts(results);
    setLoading(false);
  }, [q, filters, router]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <LoadingSpinner text="Searching products..." />;
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <SearchResultsHeader query={q} productCount={products.length} />
        <SearchContent products={products} onFiltersChange={handleFiltersChange} />
      </div>
    </div>
  );
}
