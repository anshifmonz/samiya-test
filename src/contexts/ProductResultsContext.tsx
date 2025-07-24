'use client';

import { createContext, useContext, ReactNode } from 'react';
import { SearchProduct } from 'types/product';
import { Category } from 'types/category';
import { useProducts } from 'hooks/search/useProducts';

interface ProductResultsContextType {
  // Initial values
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialCategories: Category[];

  // Dynamic state
  products: SearchProduct[];
  totalCount: number;
  loading?: boolean;
  updateProducts: (products: SearchProduct[], totalCount: number) => void;

  // Computed values
  availableColors: Array<{ name: string; hex: string }>;
  availableCategories: string[];
  availableTags: Array<{ name: string; count: number }>;
  categoryCountMap: Map<string, number>;
}

const ProductResultsContext = createContext<ProductResultsContextType | undefined>(undefined);

interface ProductResultsProviderProps {
  children: ReactNode;
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialCategories: Category[];
}

export function ProductResultsProvider({
  children,
  initialProducts,
  initialTotalCount,
  initialCategories,
}: ProductResultsProviderProps) {
  const productsHook = useProducts({
    initialProducts,
    initialTotalCount,
    initialCategories,
  });

  const value: ProductResultsContextType = {
    initialProducts,
    initialTotalCount,
    initialCategories,
    ...productsHook,
  };

  return (
    <ProductResultsContext.Provider value={value}>
      {children}
    </ProductResultsContext.Provider>
  );
}

export function useProductResults() {
  const context = useContext(ProductResultsContext);
  if (context === undefined) {
    throw new Error('useProductResults must be used within a ProductResultsProvider');
  }
  return context;
}
