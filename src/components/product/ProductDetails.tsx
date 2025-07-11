import React from 'react';
import { type Product } from '@/types/product';
import ProductColorSwatches from './ProductColorSwatches';

interface ProductDetailsProps {
  product: Product;
  selectedColor: string;
  handleColorChange: (color: string) => void;
  getColorStyle: (color: string) => string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, selectedColor, handleColorChange, getColorStyle }) => {
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
          ₹{product.price.toLocaleString()}
        </p>
        <ProductColorSwatches
          product={product}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
          getColorStyle={getColorStyle}
        />
      </div>
      <div className="pt-4">
        <button className="w-full luxury-btn-primary py-3 px-6 rounded-xl luxury-body text-base font-medium transition-all duration-300">
          Contact for Purchase
        </button>
        <p className="luxury-body text-sm text-luxury-gray mt-3 text-center">
          Call us at +91 9876543210 or visit our store
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
