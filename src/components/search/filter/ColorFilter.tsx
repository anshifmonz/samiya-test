import React from 'react';

interface ColorFilterProps {
  selectedColors: string[];
  onColorChange: (color: string, checked: boolean) => void;
  availableColors?: string[];
}

const ColorFilter: React.FC<ColorFilterProps> = ({ selectedColors, onColorChange, availableColors }) => {
  const defaultColors = ['red', 'blue', 'green', 'white', 'cream', 'navy', 'pink', 'yellow', 'purple', 'black', 'emerald', 'maroon', 'gold', 'burgundy'];

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

  const colorOptions = availableColors && availableColors.length > 0 ? availableColors : defaultColors;

  return (
    <div>
      <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Colors</h3>
      <div className="grid grid-cols-5 gap-3">
        {colorOptions.map(color => (
          <label key={color} className="flex items-center justify-center cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={(e) => onColorChange(color, e.target.checked)}
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
  );
};

export default ColorFilter;
