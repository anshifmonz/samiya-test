import { useState } from 'react';
import type { ProductFilters, UseProductFiltersProps } from '@/types';

export const useProductFilters = ({ onFiltersChange }: UseProductFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 3000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category: category === 'all' ? undefined : category });
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    updateFilters({ minPrice: value[0], maxPrice: value[1] });
  };

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

  const updateFilters = (partialFilters: Partial<ProductFilters>) => {
    const newFilters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      ...partialFilters
    };

    // remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value !== undefined)
    );

    onFiltersChange(cleanFilters);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([20, 500]);
    setSelectedColors([]);
    setSelectedTags([]);
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] > 20 || priceRange[1] < 500) count++;
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

    // Handlers
    handleCategoryChange,
    handlePriceChange,
    handleColorChange,
    handleTagToggle,

    // Actions
    clearFilters,
    getActiveFiltersCount,
  };
};
