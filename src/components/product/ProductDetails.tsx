import React, { useState } from 'react';
import { type Product } from 'types/product';
import ProductColorSwatches from './ProductColorSwatches';

interface ProductDetailsProps {
  product: Product;
  selectedColor: string;
  handleColorChange: (color: string) => void;
  getColorStyle: (color: string) => string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, selectedColor, handleColorChange, getColorStyle }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const handleWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const message =
      `Hello, I'm interested in this product!%0A` +
      `*Product ID:* ${product.short_code}%0A` +
      `*Title:* ${product.title}%0A` +
      `*Color:* ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}%0A` +
      `*Size:* ${selectedSize ? selectedSize : 'N/A'}%0A` +
      `%0A*Price:* ₹${product.price.toLocaleString()}%0A` +
      (url ? `*Link:* ${url}` : '');
    const whatsappUrl = `https://wa.me/+919562700999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-luxury-black px-4 py-2 rounded-full luxury-body text-sm font-semibold border border-luxury-black/20">
            {product.category}
          </span>
        </div>
        <h1 className="luxury-heading text-2xl lg:text-3xl font-light text-luxury-black mb-4 leading-tight">
          {product.title}
        </h1>
        <p className="luxury-body text-luxury-gray leading-relaxed">
          {product.description}
        </p>
      </div>
      <div>
        <p className="text-2xl lg:text-3xl font-bold text-luxury-black mb-2">
          ₹{product.price.toLocaleString()} {product.originalPrice && product.originalPrice > product.price && <span className="text-xs line-through">₹{product.originalPrice.toLocaleString()}</span>}
        </p>
        <ProductColorSwatches
          product={product}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
          getColorStyle={getColorStyle}
        />
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="luxury-subheading text-sm text-luxury-black mb-3 tracking-wider uppercase">
            Available Sizes
          </h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(size => {
                const isSelected = selectedSize === size.name;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(isSelected ? '' : size.name)}
                    className={`
                      px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200
                      hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50
                      ${
                        isSelected
                          ? 'bg-luxury-gold text-white border-luxury-gold shadow-md'
                          : 'bg-luxury-cream/50 text-luxury-black border-luxury-gray/20 hover:bg-luxury-cream hover:border-luxury-gray/30'
                      }
                    `}
                    type="button"
                  >
                    {size.name}
                  </button>
                );
              })
            }
          </div>
          {selectedSize && (
            <div className="mt-2 text-xs text-luxury-gray">
              Selected: {selectedSize}
            </div>
          )}
        </div>
      )}

      <div className="pt-4">
        <button
          className="w-full luxury-btn-primary py-3 px-6 rounded-xl luxury-body text-base font-medium transition-all duration-300"
          onClick={handleWhatsApp}
          type="button"
        >
          Contact for Purchase
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
