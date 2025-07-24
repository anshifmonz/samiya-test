'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from 'ui/button';
import { useDebounce } from 'hooks/useDebounce';
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
import { useProductResults } from 'contexts/ProductResultsContext';
import { useSearchFilters } from 'contexts/SearchFiltersContext';

const MobileFilterPanel: React.FC = () => {
  const {
    availableColors,
    availableCategories,
    availableTags,
    categoryCountMap,
    initialCategories: categories,
  } = useProductResults();
  const { filters, onFiltersChange, clearFilters } = useSearchFilters();
  const [isOpen, setIsOpen] = useState(false);

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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (localPriceRange[0] > 20 || localPriceRange[1] < 3000) count++;
    if (selectedColors.length > 0) count++;
    if (selectedTags.length > 0) count++;
    return count;
  };

  return (
    <div className="lg:hidden px-3 sm:px-5 pt-6">
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
    </div>
  );
};

export default MobileFilterPanel;
