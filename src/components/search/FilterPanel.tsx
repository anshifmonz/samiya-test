
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CategoryFilter from './filter/CategoryFilter';
import PriceFilter from './filter/PriceFilter';
import ColorFilter from './filter/ColorFilter';
import TagsFilter from './filter/TagsFilter';

type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
};

interface FilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  availableColors?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange, availableColors }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number]>([2000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category: category === 'all' ? undefined : category });
  };

  const handlePriceChange = (value: [number]) => {
    setPriceRange(value);
    updateFilters({ maxPrice: value[0] });
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

  const updateFilters = (partialFilters: ProductFilters) => {
    const newFilters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      minPrice: 0,
      maxPrice: priceRange[0],
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
    setPriceRange([2000]);
    setSelectedColors([]);
    setSelectedTags([]);
    onFiltersChange({});
  };

  return (
    <div className="w-80">
      <div className="sticky top-28">
        <div className="luxury-card rounded-xl border border-luxury-gray/10 shadow-lg bg-white/95 backdrop-blur-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="luxury-heading text-xl text-luxury-black">Filters</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-luxury-gray/30 text-luxury-gray hover:bg-luxury-cream hover:border-luxury-gold/50 transition-all duration-300 luxury-body text-sm"
            >
              Clear All
            </Button>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <PriceFilter
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
          />

          <ColorFilter
            selectedColors={selectedColors}
            onColorChange={handleColorChange}
            availableColors={availableColors}
          />

          <TagsFilter
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
