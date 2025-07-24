import { type Product } from 'types/product';

interface SizeSelectorProps {
  sizes: Product['sizes'];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  const standardSizes = ["XS", "S", "M", "L", "XL"];
  const extraSizes = ["2XL", "3XL", "Free Size"];
  const availableSizes = sizes?.map(size => size.name) || [];

  const filteredSizes = [
    ...standardSizes,
    ...extraSizes.filter(size => availableSizes.includes(size))
  ];

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Size</span>
      <div className="flex flex-wrap gap-2">
        {filteredSizes.map(size => {
          const isAvailable = availableSizes.includes(size);
          return (
            <button
              key={size}
              onClick={() => isAvailable && onSizeChange(selectedSize === size ? '' : size)}
              className={`relative px-4 py-2 text-sm font-medium rounded border transition-all duration-200 ${
                isAvailable
                  ? selectedSize === size
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border hover:border-foreground'
                  : 'bg-muted/50 text-muted-foreground/50 border-muted cursor-not-allowed'
              }`}
              disabled={!isAvailable}
            >
              {size}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px bg-muted-foreground/60 rotate-45 transform origin-center"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
