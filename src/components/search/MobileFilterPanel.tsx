'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from 'ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ui/sheet';
import CategoryFilter from './filter/CategoryFilter';
import PriceFilter from './filter/PriceFilter';
import ColorFilter from './filter/ColorFilter';
import TagsFilter from './filter/TagsFilter';
import { useProductFilters } from 'hooks/search/useProductFilters';
import { type ProductFilters } from 'types/product';
import { type Category } from 'types/category';

interface MobileFilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  availableColors?: Array<{ name: string; hex: string }>;
  availableCategories?: string[];
  availableTags?: Array<{ name: string; count: number }>;
  categories: Category[];
  categoryCountMap?: Map<string, number>;
  filters?: ProductFilters;
}

const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({ onFiltersChange, availableColors, availableCategories, availableTags, categories, categoryCountMap, filters }) => {
  const [isOpen, setIsOpen] = useState(false);

  // handle browser back button to close sidebar if open
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ mobileFilterOpen: true }, '');
    const handlePopState = () => {
      setIsOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state && window.history.state.mobileFilterOpen) {
        window.history.back();
      }
    };
  }, [isOpen]);

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
    getActiveFiltersCount,
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
    <div className="mb-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-border text-foreground hover:bg-muted hover:border-primary/50 transition-all duration-300 font-medium py-3 px-4 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-primary" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-80 bg-background border-border">
          <SheetHeader className="text-left pb-6 border-b border-border">
            <SheetTitle className="text-lg font-semibold text-foreground">Filters</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Refine your search results
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
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

            <div className="border-t border-border pt-6 pb-4 space-y-3">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Clear All Filters
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilterPanel;
