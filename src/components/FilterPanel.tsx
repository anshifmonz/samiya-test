
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

  const updateFilters = (partialFilters: any) => {
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Filters</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300"
        >
          Clear All
        </Button>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 tracking-wide">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-rose-600 border-2 border-gray-300 focus:ring-rose-500 focus:ring-2 transition-all duration-200"
              />
              <span className="text-gray-700 font-medium capitalize group-hover:text-rose-600 transition-colors duration-200">
                {category === 'all' ? 'All Categories' : category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 tracking-wide">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2 font-medium">
            <span>₹0</span>
            <span className="text-rose-600 font-bold">₹{priceRange[0]}</span>
          </div>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 tracking-wide">Colors</h3>
        <div className="grid grid-cols-5 gap-2">
          {colors.map(color => (
            <label key={color} className="flex items-center justify-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={(e) => handleColorChange(color, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-7 h-7 rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${
                  selectedColors.includes(color) 
                    ? 'border-rose-600 ring-2 ring-rose-200 shadow-md' 
                    : 'border-gray-300 hover:border-rose-400 shadow-sm hover:shadow-md'
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
        <h3 className="font-bold text-gray-800 mb-3 tracking-wide">Tags</h3>
        <div className="space-y-2">
          {tags.map(tag => (
            <label key={tag} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox
                checked={selectedTags.includes(tag)}
                onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                className="border-2 border-gray-300 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
              />
              <span className="text-gray-700 font-medium capitalize group-hover:text-rose-600 transition-colors duration-200">
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
