import { type Product, type Size } from 'types/product';
import { useSizes } from 'hooks/public/useSizes';

interface SizeSelectorProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({ product, selectedColor, selectedSize, onSizeChange }: SizeSelectorProps) {
  const { sizes: allSizes } = useSizes();
  
  // Get sizes available for the selected color from product_color_size data
  const getAvailableSizes = (): Size[] => {
    // Check if the selected color has specific sizes from product_color_size data
    if (product.colorSizes && product.colorSizes[selectedColor] && product.colorSizes[selectedColor].length > 0) {
      return product.colorSizes[selectedColor];
    }
    
    // Check if the color data itself has sizes (from images object)
    if (product.images[selectedColor]?.sizes && product.images[selectedColor].sizes!.length > 0) {
      return product.images[selectedColor].sizes!;
    }
    
    // Fall back to global product sizes
    return product.sizes || [];
  };
  
  const sizes = getAvailableSizes();
  const standardSizes = ["S", "M", "L", "XL"];
  const availableSizes = sizes?.map(size => size.name) || [];

  const allPossibleSizes = allSizes.length > 0
    ? allSizes.map(size => size.name).sort((a, b) => {
        const aSize = allSizes.find(s => s.name === a);
        const bSize = allSizes.find(s => s.name === b);
        return (aSize?.sort_order || 0) - (bSize?.sort_order || 0);
      })
    : standardSizes;

  let sizesToDisplay: string[];

  if (availableSizes.length === 0) {
    // show standardSizes as placeholders if no sizes are available
    sizesToDisplay = standardSizes;
  } else if (availableSizes.length < 4) {
    // show standardSizes + available sizes (deduplicated)
    const combinedSizes = [...standardSizes, ...availableSizes];
    sizesToDisplay = combinedSizes.filter((size, index) => combinedSizes.indexOf(size) === index);
  } else {
    // sizes > 4 show only available sizes from allPossibleSizes
    sizesToDisplay = allPossibleSizes.filter(size => availableSizes.includes(size));
  }

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Size</span>
      <div className="flex flex-wrap gap-2">
        {sizesToDisplay.map(size => {
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
