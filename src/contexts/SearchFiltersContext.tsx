'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { ProductFilters } from 'types/product';
import { useProductFiltersForContext } from 'hooks/search/useProductFilters';

interface SearchFiltersContextType {
  // Initial values
  initialFilters: ProductFilters;
  initialQuery: string;
  source?: string;

  // Dynamic state
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  clearFilters: () => void;
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(undefined);

interface SearchFiltersProviderProps {
  children: ReactNode;
  initialFilters: ProductFilters;
  initialQuery: string;
  source?: string;
}

export function SearchFiltersProvider({
  children,
  initialFilters,
  initialQuery,
  source,
}: SearchFiltersProviderProps) {
  const filtersHook = useProductFiltersForContext({
    initialFilters,
  });

  const value = useMemo<SearchFiltersContextType>(() => ({
    initialFilters,
    initialQuery,
    source,
    ...filtersHook,
  }), [initialFilters, initialQuery, source, filtersHook]);

  return (
    <SearchFiltersContext.Provider value={value}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

export function useSearchFilters() {
  const context = useContext(SearchFiltersContext);
  if (context === undefined) {
    throw new Error('useSearchFilters must be used within a SearchFiltersProvider');
  }
  return context;
}
