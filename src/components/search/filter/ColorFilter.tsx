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
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Colors</h3>
      <div className="grid grid-cols-4 gap-2">
        {colorOptions.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color, !selectedColors.includes(color))}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              selectedColors.includes(color)
                ? "border-primary scale-110 shadow-md"
                : "border-border hover:border-primary/50"
            } ${color === "white" ? "border-gray-300" : ""}`}
            style={{ backgroundColor: getColorStyle(color) }}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
