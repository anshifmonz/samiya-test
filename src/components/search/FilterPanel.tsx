'use client';

import { Button } from 'ui/button';
import CategoryFilter from './filter/CategoryFilter';
import PriceFilter from './filter/PriceFilter';
import ColorFilter from './filter/ColorFilter';
import TagsFilter from './filter/TagsFilter';
import { useProductResults } from 'contexts/ProductResultsContext';
import { useSearchFilters } from 'contexts/SearchFiltersContext';
import { useDebounce } from 'hooks/useDebounce';
import { useState, useEffect } from 'react';

const FilterPanel: React.FC = () => {
  const {
    availableColors,
    availableCategories,
    availableTags,
    categoryCountMap,
    initialCategories: categories,
  } = useProductResults();
  const { filters, onFiltersChange, clearFilters } = useSearchFilters();

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    filters?.minPrice !== undefined ? filters.minPrice : 20,
    filters?.maxPrice !== undefined ? filters.maxPrice : 3000,
  ]);

  useEffect(() => {
    setLocalPriceRange([
      filters?.minPrice !== undefined ? filters.minPrice : 20,
      filters?.maxPrice !== undefined ? filters.maxPrice : 3000,
    ]);
  }, [filters?.minPrice, filters?.maxPrice]);

  const selectedCategory = filters?.category || 'all';
  const selectedColors = filters?.colors || [];
  const selectedTags = filters?.tags || [];

  const debouncedPriceChange = useDebounce((value: [number, number]) => {
    onFiltersChange({
      minPrice: value[0] !== 20 ? value[0] : undefined,
      maxPrice: value[1] !== 3000 ? value[1] : undefined
    });
  }, 400);

  const handleCategoryChange = (category: string) => {
    if (selectedCategory === category && category !== 'all') {
      onFiltersChange({ category: undefined });
    } else {
      onFiltersChange({ category: category === 'all' ? undefined : category });
    }
  };

  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    debouncedPriceChange(value);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, color]
      : selectedColors.filter(c => c !== color);
    onFiltersChange({ colors: newColors.length > 0 ? newColors : undefined });
  };

  const handleTagToggle = (tag: string) => {
    const isCurrentlySelected = selectedTags.includes(tag);
    const newTags = isCurrentlySelected
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined });
  };

  return (
    <div className="hidden lg:block">
      <div className="w-80 bg-filter-bg border-r border-border p-6 space-y-6 h-fit sticky top-4 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            availableCategories={availableCategories}
            categories={categories}
            categoryCountMap={categoryCountMap}
          />

          <div className="border-t border-border pt-6">
            <PriceFilter
              priceRange={localPriceRange}
              onPriceChange={handlePriceChange}
            />
          </div>

          <div className="border-t border-border pt-6">
            <ColorFilter
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
              availableColors={availableColors}
            />
          </div>

          <div className="border-t border-border pt-6">
            <TagsFilter
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={availableTags}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
