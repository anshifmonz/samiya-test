import { useProductContext } from 'contexts/ProductContext';

export default function ColorSelector() {
  const { product, isArchive, selectedColor, handleColorChange, getColorStyle } =
    useProductContext();

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Color:</span>
        <span className="text-sm">
          {selectedColor ? selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) : ''}
        </span>
      </div>
      <div className="flex space-x-2">
        {Object.keys(product.images).map(color => (
          <button
            key={color}
            onClick={() => handleColorChange(color)}
            className={`w-8 h-8 rounded-full ${
              selectedColor === color ? 'border-foreground ring-2 ring-offset-2' : 'border-border'
            } ${isArchive ? 'cursor-not-allowed opacity-50' : ''}`}
            style={{ backgroundColor: product.images[color]?.hex || getColorStyle(color) }}
            title={color ? color.charAt(0).toUpperCase() + color.slice(1) : ''}
            disabled={isArchive}
          />
        ))}
      </div>
    </div>
  );
}
