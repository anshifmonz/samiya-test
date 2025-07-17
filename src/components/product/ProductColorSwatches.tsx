import { type Product } from 'types/product';

interface ProductColorSwatchesProps {
  product: Product;
  selectedColor: string;
  handleColorChange: (color: string) => void;
  getColorStyle: (color: string) => string;
}

const ProductColorSwatches: React.FC<ProductColorSwatchesProps> = ({ product, selectedColor, handleColorChange, getColorStyle }) => {
  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-start">
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {Object.keys(product.images).map(color => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border-2
                ${selectedColor === color
                  ? 'border-white ring-2 ring-black'
                  : 'border-white hover:ring-black hover:ring-1 hover:ring-black'}
              `}
              style={{ backgroundColor: product.images[color]?.hex || getColorStyle(color) }}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductColorSwatches;
