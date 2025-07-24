'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SearchContent from './SearchContent';
import { useSearchContext } from 'contexts/SearchContext';

export default function SearchPage() {
  const { initialQuery, filters, source } = useSearchContext();
  const router = useRouter();
  const isUrlSyncInitialized = useRef(false);

  // sync url with current filters and query
  useEffect(() => {
    if (!isUrlSyncInitialized.current) {
      isUrlSyncInitialized.current = true;
      return;
    }

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

    if (filters.sortOrder && filters.sortOrder !== 'relevance')
      params.set('sortOrder', filters.sortOrder);

    if (source) params.set('source', source);

    const newUrl = `${window.location.pathname}?${params.toString()}`;

    if (newUrl !== window.location.href)
      router.replace(newUrl, { scroll: false });
  }, [filters, initialQuery, router, source]);

  return (
    <SearchContent />
  );
}
