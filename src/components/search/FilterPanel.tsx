import React from 'react';
import { Button } from '@/components/ui/button';
import CategoryFilter from './filter/CategoryFilter';
import PriceFilter from './filter/PriceFilter';
import ColorFilter from './filter/ColorFilter';
import TagsFilter from './filter/TagsFilter';
import { useProductFilters, type ProductFilters } from '@/hooks/useProductFilters';

interface FilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  availableColors?: string[];
  availableCategories?: string[];
  availableTags?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange, availableColors, availableCategories, availableTags }) => {
  const {
    selectedCategory,
    priceRange,
    selectedColors,
    selectedTags,
    handleCategoryChange,
    handlePriceChange,
    handleColorChange,
    handleTagToggle,
    clearFilters,
  } = useProductFilters({ onFiltersChange });

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
            availableCategories={availableCategories}
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
            availableTags={availableTags}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
