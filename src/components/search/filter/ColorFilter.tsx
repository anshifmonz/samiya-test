'use client';

interface ColorFilterProps {
  selectedColors: string[];
  onColorChange: (color: string, checked: boolean) => void;
  availableColors?: Array<{ name: string; hex: string }>;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ selectedColors, onColorChange, availableColors }) => {
  if (!availableColors || availableColors.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Colors</h3>
      <div className="grid grid-cols-4 gap-2">
        {availableColors.map(color => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name, !selectedColors.includes(color.name))}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              selectedColors.includes(color.name)
                ? "border-primary scale-110 shadow-md"
                : "border-border hover:border-primary/50"
            } ${color.hex === '#FFFFFF' ? "border-gray-300" : ""}`}
            style={{ backgroundColor: color.hex }}
            title={color.name.charAt(0).toUpperCase() + color.name.slice(1)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
