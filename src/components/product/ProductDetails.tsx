import React from 'react';
import { type Product } from 'types/product';
import ProductColorSwatches from './ProductColorSwatches';

interface ProductDetailsProps {
  product: Product;
  selectedColor: string;
  handleColorChange: (color: string) => void;
  getColorStyle: (color: string) => string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, selectedColor, handleColorChange, getColorStyle }) => {
  const handleWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const message =
      `Hello, I'm interested in this product!%0A` +
      `*Product ID:* ${product.short_code}%0A` +
      `*Title:* ${product.title}%0A` +
      `*Color:* ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}%0A` +
      `*Price:* ₹${product.price.toLocaleString()}%0A` +
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
