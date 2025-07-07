import { Slider } from 'ui/slider';

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, onPriceChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-foreground">Price Range</h3>
      <div className="px-3">
        <Slider
          value={priceRange}
          onValueChange={onPriceChange}
          max={3000}
          min={0}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
