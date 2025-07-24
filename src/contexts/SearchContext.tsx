'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { SearchProduct, ProductFilters } from 'types/product';
import { Category } from 'types/category';
import useSearchContextLogic from 'hooks/search/useSearchContextLogic';

interface SearchContextType {
  // Initial values
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
  source?: string;

  // Dynamic state
  products: SearchProduct[];
  totalCount: number;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  updateProducts: (products: SearchProduct[], totalCount: number) => void;

  // Computed values
  availableColors: Array<{ name: string; hex: string }>;
  availableCategories: string[];
  availableTags: Array<{ name: string; count: number }>;
  categoryCountMap: Map<string, number>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
  source?: string;
}

export function SearchProvider({
  children,
  initialProducts,
  initialTotalCount,
  initialQuery,
  initialFilters,
  initialCategories,
  source,
}: SearchProviderProps) {
  const logic = useSearchContextLogic({
    initialProducts,
    initialTotalCount,
    initialQuery,
    initialFilters,
    initialCategories,
  });

  const value: SearchContextType = {
    initialProducts,
    initialTotalCount,
    initialQuery,
    initialFilters,
    initialCategories,
    source,
    ...logic,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
