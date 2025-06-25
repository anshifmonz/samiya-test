import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface FilterPanelProps {
  onFiltersChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    tags?: string[];
  }) => void;
}

interface FilterUpdate {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number]>([2000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = ['all', 'Gents', 'Women', 'Kids'];
  const colors = ['red', 'blue', 'green', 'white', 'cream', 'navy', 'pink', 'yellow', 'purple', 'black', 'emerald', 'maroon', 'gold', 'burgundy'];
  const tags = ['wedding', 'festive', 'silk', 'cotton', 'traditional', 'formal', 'office', 'embroidery', 'kids'];

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

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    updateFilters({ tags: newTags.length > 0 ? newTags : undefined });
  };

  const updateFilters = (partialFilters: FilterUpdate) => {
    const newFilters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      minPrice: 0,
      maxPrice: priceRange[0],
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      ...partialFilters
    };

    // Remove undefined values
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

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      red: '#DC2626',
      blue: '#2563EB',
      green: '#16A34A',
      white: '#FFFFFF',
      cream: '#F5F5DC',
      navy: '#000080',
      pink: '#EC4899',
      yellow: '#EAB308',
      purple: '#9333EA',
      black: '#000000',
      emerald: '#059669',
      maroon: '#7C2D12',
      gold: '#D97706',
      burgundy: '#7C2D12'
    };
    return colorMap[color] || color;
  };

  return (
    <div className="lg:w-1/4">
      <div className="sticky top-24">
        <div className="animate-fade-in-left">
          <div className="luxury-card rounded-3xl p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="luxury-heading text-2xl text-luxury-black">Filters</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-luxury-gray/30 text-luxury-gray hover:bg-luxury-cream hover:border-luxury-gold/50 transition-all duration-300 luxury-body"
              >
                Clear All
              </Button>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Category</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-luxury-gold border-2 border-luxury-gray/30 focus:ring-luxury-gold/50 focus:ring-2 transition-all duration-200"
                    />
                    <span className="luxury-body text-luxury-gray font-medium capitalize group-hover:text-luxury-gold transition-colors duration-200">
                      {category === 'all' ? 'All Categories' : category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Price Range</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between luxury-body text-sm text-luxury-gray mt-3 font-medium">
                  <span>₹0</span>
                  <span className="text-luxury-gold font-bold">₹{priceRange[0]}</span>
                </div>
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Colors</h3>
              <div className="grid grid-cols-5 gap-3">
                {colors.map(color => (
                  <label key={color} className="flex items-center justify-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={(e) => handleColorChange(color, e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${
                        selectedColors.includes(color)
                          ? 'border-luxury-gold ring-2 ring-luxury-gold/20 shadow-lg'
                          : 'border-luxury-gray/30 hover:border-luxury-gold/50 shadow-sm hover:shadow-md'
                      }`}
                      style={{ backgroundColor: getColorStyle(color) }}
                      title={color}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Tags</h3>
              <div className="space-y-3">
                {tags.map(tag => (
                  <label key={tag} className="flex items-center space-x-3 cursor-pointer group">
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                      className="border-2 border-luxury-gray/30 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
                    />
                    <span className="luxury-body text-luxury-gray font-medium capitalize group-hover:text-luxury-gold transition-colors duration-200">
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
