'use client';

import { Button } from 'ui/button';
import CategoryFilter from './filter/CategoryFilter';
import PriceFilter from './filter/PriceFilter';
import ColorFilter from './filter/ColorFilter';
import TagsFilter from './filter/TagsFilter';
import { useProductFilters } from 'hooks/search/useProductFilters';
import { SearchProduct, type ProductFilters } from 'types/product';
import { type Category } from 'types/category';

interface FilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  availableColors?: Array<{ name: string; hex: string }>;
  availableCategories?: string[];
  availableTags?: string[];
  categories: Category[];
  categoryCountMap?: Map<string, number>;
  filters?: ProductFilters;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange, availableColors, availableCategories, availableTags, categories, categoryCountMap, filters }) => {
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
  } = useProductFilters({
    onFiltersChange,
    initialCategory: filters?.category || 'all',
    initialPriceRange: [
      filters?.minPrice !== undefined ? filters.minPrice : 20,
      filters?.maxPrice !== undefined ? filters.maxPrice : 3000,
    ],
    initialColors: filters?.colors || [],
    initialTags: filters?.tags || [],
  });

  return (
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
            priceRange={priceRange}
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
  );
};

export default FilterPanel;
