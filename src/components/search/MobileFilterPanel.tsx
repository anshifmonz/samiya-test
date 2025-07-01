import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from 'ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CategoryFilter from './filter/CategoryFilter';
import PriceFilter from './filter/PriceFilter';
import ColorFilter from './filter/ColorFilter';
import TagsFilter from './filter/TagsFilter';
import { useProductFilters } from '@/hooks/useProductFilters';
import { type ProductFilters } from '@/types/product';

interface MobileFilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  availableColors?: string[];
  availableCategories?: string[];
  availableTags?: string[];
}

const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({ onFiltersChange, availableColors, availableCategories, availableTags }) => {
  const [isOpen, setIsOpen] = useState(false);

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
  } = useProductFilters({ onFiltersChange });

  return (
    <div className="mb-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-luxury-gray/30 text-luxury-black hover:bg-luxury-cream hover:border-luxury-gold/50 transition-all duration-300 luxury-body font-medium py-3 px-4 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-luxury-gold" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-luxury-gold text-white text-xs px-2 py-1 rounded-full font-medium">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-80 bg-luxury-cream border-luxury-gray/20">
          <SheetHeader className="text-left pb-6 border-b border-luxury-gray/20">
            <SheetTitle className="luxury-heading text-2xl text-luxury-black">Filters</SheetTitle>
            <SheetDescription className="luxury-body text-luxury-gray">
              Refine your search results
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6 space-y-8">
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

            <div className="border-t border-luxury-gray/20 pt-6 pb-4 space-y-3">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full border-luxury-gray/30 text-luxury-gray hover:bg-luxury-cream hover:border-luxury-gold/50 transition-all duration-300 luxury-body font-medium"
              >
                Clear All Filters
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full luxury-btn-primary luxury-body font-medium"
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
