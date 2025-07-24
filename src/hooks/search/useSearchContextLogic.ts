'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchProduct, ProductFilters } from 'types/product';
import { Category } from 'types/category';

interface UseSearchContextLogicProps {
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialQuery: string;
  initialFilters: ProductFilters;
  initialCategories: Category[];
}

/**
 * Custom hook that manages all search-related state, effects, and derived values.
 * Extracted from SearchContext to separate concerns and improve maintainability.
 * 
 * @param props - Initial values for search state
 * @returns Object containing all search state, handlers, and computed values
 */
export default function useSearchContextLogic({
  initialProducts,
  initialTotalCount,
  initialQuery,
  initialFilters,
  initialCategories,
}: UseSearchContextLogicProps) {
  // Dynamic state
  const [products, setProducts] = useState<SearchProduct[]>(initialProducts);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
const [filters, setFilters] = useState<ProductFilters>({ ...initialFilters, sortOrder: initialFilters.sortOrder || 'relevance' });

  // Handle filter changes
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Method to update products externally
  const updateProducts = (newProducts: SearchProduct[], newTotalCount: number) => {
    setProducts(newProducts);
    setTotalCount(newTotalCount);
  };

  // Update products when initial values change
  useEffect(() => {
    setProducts(initialProducts);
    setTotalCount(initialTotalCount);
  }, [initialProducts, initialTotalCount]);

  // Computed values
  const computedValues = useMemo(() => {
    // Collect all unique colors from the current products with their hex codes
    const colorMap = new Map<string, string>();
    products.forEach(product => {
      if (product.images) {
        Object.entries(product.images).forEach(([colorName, colorData]) => {
          if (colorData.hex && colorData.hex !== '######') {
            colorMap.set(colorName, colorData.hex);
          }
        });
      }
    });
    const availableColors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));

    // Calculate category counts and available categories
    const categoryCountMap = new Map<string, number>();
    products.forEach(product => {
      if (product.categoryId) {
        categoryCountMap.set(product.categoryId, (categoryCountMap.get(product.categoryId) || 0) + 1);
      }
    });
    const availableCategories = Array.from(categoryCountMap.keys()).map(id => 
      initialCategories.find(cat => cat.id === id)?.name || ''
    );

    // Calculate tag counts and available tags
    const tagCountMap = new Map<string, number>();
    products.forEach(product => {
      if (product.tags) {
        product.tags.forEach((tag: string) => {
          tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
        });
      }
    });
    const availableTags = Array.from(tagCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      availableColors,
      availableCategories,
      availableTags,
      categoryCountMap,
    };
  }, [products, initialCategories]);

  return {
    products,
    totalCount,
    filters,
    onFiltersChange: handleFiltersChange,
    updateProducts,
    ...computedValues,
  };
}
