import React from 'react';
import { Slider } from 'ui/slider';

interface PriceFilterProps {
  priceRange: [number];
  onPriceChange: (value: [number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, onPriceChange }) => {
  return (
    <div>
      <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Price Range</h3>
      <div className="px-2">
        <Slider
          value={priceRange}
          onValueChange={onPriceChange}
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
  );
};

export default PriceFilter;
