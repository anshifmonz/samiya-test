
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
    updateFilters({ category });
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
    updateFilters({ colors: newColors });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked 
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    updateFilters({ tags: newTags });
  };

  const updateFilters = (partialFilters: any) => {
    onFiltersChange({
      category: selectedCategory,
      minPrice: 0,
      maxPrice: priceRange[0],
      colors: selectedColors,
      tags: selectedTags,
      ...partialFilters
    });
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
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 capitalize">
                {category === 'all' ? 'All Categories' : category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>₹0</span>
            <span>₹{priceRange[0]}</span>
          </div>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Colors</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map(color => (
            <label key={color} className="flex items-center justify-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={(e) => handleColorChange(color, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColors.includes(color) 
                    ? 'border-indigo-600 ring-2 ring-indigo-200' 
                    : 'border-gray-300 hover:border-gray-400'
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
        <h3 className="font-semibold text-gray-700 mb-3">Tags</h3>
        <div className="space-y-2">
          {tags.map(tag => (
            <label key={tag} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={selectedTags.includes(tag)}
                onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
              />
              <span className="text-gray-700 capitalize">{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
