import { type Size } from 'types/product';
import React from 'react';
import { useAdminProductFormColorSizes } from './AdminProductFormContext';
import { useProductsTab } from 'contexts/admin/ProductsTabContext';

interface ColorSizeSelectProps {
  color: string;
}

const ColorSizeSelect: React.FC<ColorSizeSelectProps> = ({ color }) => {
  const { handleColorSizesChange, getColorSizes } = useAdminProductFormColorSizes();
  const sizes = getColorSizes(color);
  const { sizes: availableSizes } = useProductsTab();

  const handleSizeToggle = (size: Size) => {
    const isSelected = sizes.some(s => s.id === size.id || s.name === size.name);
    if (isSelected) {
      handleColorSizesChange(color, sizes.filter(s => s.id !== size.id && s.name !== size.name));
    } else {
      handleColorSizesChange(color, [...sizes, size]);
    }
  };

  const isSizeSelected = (size: Size) => {
    return sizes.some(s => s.id === size.id || s.name === size.name);
  };

  return (
    <div className="mt-4">
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Available Sizes for {color.charAt(0).toUpperCase() + color.slice(1)}
      </label>
      <div className="flex gap-2 flex-wrap">
        {availableSizes.map(size => {
          const isSelected = isSizeSelected(size);
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`
                w-12 h-12 rounded-lg border-2 font-medium text-sm transition-all duration-200
                hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50
                ${
                  isSelected
                    ? 'bg-luxury-gold text-white border-luxury-gold shadow-md'
                    : 'bg-luxury-cream/50 text-luxury-black border-luxury-gray/20 hover:bg-luxury-cream hover:border-luxury-gray/30'
                }
              `}
            >
              {size.name}
            </button>
          );
        })}
      </div>
      {sizes.length > 0 && (
        <div className="mt-2 text-xs text-luxury-gray">
          Selected: {sizes.map(s => s.name).join(', ')}
        </div>
      )}
      <div className="mt-2 text-xs text-luxury-gray/60">
        Leave empty to use global product sizes for this color
      </div>
    </div>
  );
};

export default ColorSizeSelect;
