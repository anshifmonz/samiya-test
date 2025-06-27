
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
};

interface MobileFilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  availableColors?: string[];
}

const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({ onFiltersChange, availableColors }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number]>([2000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] < 2000) count++;
    if (selectedColors.length > 0) count++;
    if (selectedTags.length > 0) count++;
    return count;
  };

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
