import { useState, useCallback, useRef, useEffect } from 'react';
import type { ProductFilters, UseProductFiltersProps } from '@/types';

interface UseProductFiltersPropsWithInitial extends UseProductFiltersProps {
  initialCategory?: string;
  initialPriceRange?: [number, number];
  initialColors?: string[];
  initialTags?: string[];
  initialSortOrder?: string;
}

export const useProductFilters = ({
  onFiltersChange,
  initialCategory = 'all',
  initialPriceRange = [20, 3000],
  initialColors = [],
  initialTags = [],
  initialSortOrder = 'relevance',
}: UseProductFiltersPropsWithInitial) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [selectedSortOrder, setSelectedSortOrder] = useState<string>(initialSortOrder);

  // Debounce timer ref for price changes
  const priceDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const updateFilters = useCallback((partialFilters: Partial<ProductFilters>) => {
    const newFilters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      sortOrder: selectedSortOrder === 'relevance' ? undefined : selectedSortOrder,
      ...partialFilters
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value !== undefined)
    );

    onFiltersChange(cleanFilters);
  }, [selectedCategory, priceRange, selectedColors, selectedTags, selectedSortOrder, onFiltersChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category: category === 'all' ? undefined : category });
  };

  /**
   * Handles price range changes with debouncing to prevent excessive API calls.
   * The UI updates immediately for responsiveness, but the API call is debounced by 400ms.
   * This ensures smooth slider interaction while minimizing server requests.
   */
  const handlePriceChange = useCallback((value: [number, number]) => {
    // Update UI immediately for responsiveness
    setPriceRange(value);

    // Clear existing timer to reset debounce
    if (priceDebounceTimer.current) {
      clearTimeout(priceDebounceTimer.current);
    }

    // Set new timer to debounce the API call by 400ms
    priceDebounceTimer.current = setTimeout(() => {
      updateFilters({ minPrice: value[0], maxPrice: value[1] });
    }, 400);
  }, [updateFilters]);

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, color]
      : selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    updateFilters({ colors: newColors.length > 0 ? newColors : undefined });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags => {
      const isCurrentlySelected = prevTags.includes(tag);
      const newTags = isCurrentlySelected
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag];

      updateFilters({ tags: newTags.length > 0 ? newTags : undefined });
      return newTags;
    });
  };

  const handleSortChange = (sortOrder: string) => {
    setSelectedSortOrder(sortOrder);
    updateFilters({ sortOrder: sortOrder === 'relevance' ? undefined : sortOrder });
  };

  const clearFilters = () => {
    if (priceDebounceTimer.current) {
      clearTimeout(priceDebounceTimer.current);
      priceDebounceTimer.current = null;
    }

    setSelectedCategory('all');
    setPriceRange([20, 3000]);
    setSelectedColors([]);
    setSelectedTags([]);
    setSelectedSortOrder('relevance');

    onFiltersChange({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      colors: undefined,
      tags: undefined,
      sortOrder: undefined,
    });
  };

  useEffect(() => {
    return () => {
      if (priceDebounceTimer.current) {
        clearTimeout(priceDebounceTimer.current);
      }
    };
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] > 20 || priceRange[1] < 3000) count++;
    if (selectedColors.length > 0) count++;
    if (selectedTags.length > 0) count++;
    return count;
  };

  return {
    // State
    selectedCategory,
    priceRange,
    selectedColors,
    selectedTags,
    selectedSortOrder,

    // Handlers
    handleCategoryChange,
    handlePriceChange,
    handleColorChange,
    handleTagToggle,
    handleSortChange,

    // Actions
    clearFilters,
    getActiveFiltersCount,
  };
};
