'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchProduct } from 'types/product';
import { Category } from 'types/category';

interface UseProductsProps {
  initialProducts: SearchProduct[];
  initialTotalCount: number;
  initialCategories: Category[];
}

/**
 * Custom hook that manages product data, counts, and computed values.
 * Extracted from the original useSearchContextLogic to focus specifically on product management.
 *
 * @param props - Initial values for product state
 * @returns Object containing product state, handlers, and computed values
 */
export function useProducts({
  initialProducts,
  initialTotalCount,
  initialCategories,
}: UseProductsProps) {
  // Dynamic state
  const [products, setProducts] = useState<SearchProduct[]>(initialProducts);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [loading, setLoading] = useState<boolean>(false);

  // Method to update products externally
  const updateProducts = (newProducts: SearchProduct[], newTotalCount: number) => {
    setProducts(newProducts);
    setTotalCount(newTotalCount);
  };

  // Method to set loading state
  const setProductsLoading = (isLoading: boolean) => {
    setLoading(isLoading);
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
          if (colorData && typeof colorData === 'object' && 'hex' in colorData) {
            const hex = (colorData as any).hex;
            if (hex && hex !== '######') {
              colorMap.set(colorName, hex);
            }
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
    // State
    products,
    totalCount,
    loading,
    
    // Actions
    updateProducts,
    setProductsLoading,
    
    // Computed values
    ...computedValues,
  };
}
