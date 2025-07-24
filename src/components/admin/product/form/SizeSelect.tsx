import { type Size } from 'types/product';
import React from 'react';
import { useAdminProductFormFields } from './AdminProductFormContext';

const sizeIdMap: Record<string, string> = {
  XS: 'xs',
  S: 's',
  M: 'm',
  L: 'l',
  XL: 'xl',
  '2XL': '2xl',
  '3XL': '3xl',
  'Free Size': 'f',
};

const standardSizes: Size[] = [
  { id: sizeIdMap.XS, name: 'XS', sort_order: 1 },
  { id: sizeIdMap.S, name: 'S', sort_order: 2 },
  { id: sizeIdMap.M, name: 'M', sort_order: 3 },
  { id: sizeIdMap.L, name: 'L', sort_order: 4 },
  { id: sizeIdMap.XL, name: 'XL', sort_order: 5 },
  { id: sizeIdMap['2XL'], name: '2XL', sort_order: 6 },
  { id: sizeIdMap['3XL'], name: '3XL', sort_order: 7 },
  { id: sizeIdMap['Free Size'], name: 'Free Size', sort_order: 8 },
];

const SizeSelect: React.FC = () => {
  const { formData, handleSizesChange } = useAdminProductFormFields();
  const sizes = formData.sizes;
  const onSizesChange = handleSizesChange;
  const handleSizeToggle = (size: Size) => {
    const isSelected = sizes.some(s => s.id === size.id || s.name === size.name);
    if (isSelected) {
      onSizesChange(sizes.filter(s => s.id !== size.id && s.name !== size.name));
    } else {
      onSizesChange([...sizes, size]);
    }
  };

  const isSizeSelected = (size: Size) => {
    return sizes.some(s => s.id === size.id || s.name === size.name);
  };

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Available Sizes
      </label>
      <div className="flex gap-2 flex-wrap">
        {standardSizes.map(size => {
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
    </div>
  );
};

export default SizeSelect;
