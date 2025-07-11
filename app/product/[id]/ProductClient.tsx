"use client";

import React, { useState } from 'react';
import { type Product } from '@/types/product';
import ProductImageGallery from 'components/product/ProductImageGallery';
import ProductDetails from 'components/product/ProductDetails';

interface Props {
  product: Product;
  initialColor: string;
}

export default function ProductClient({ product, initialColor }: Props) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

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
      burgundy: '#7C2D12',
      beige: '#F5F5DC',
      olive: '#808000',
      offwhite: '#FAF0E6',
      grey: '#808080',
      charcoal: '#36454F',
      midnight: '#191970',
      light: '#ADD8E6',
      dark: '#006400',
      peach: '#FFCBA4',
      lavender: '#E6E6FA',
      mint: '#98FB98'
    };
    return colorMap[color] || color;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-12 items-center">
      <ProductImageGallery product={product} selectedColor={selectedColor} />
      <div className="space-y-6 w-full">
        <ProductDetails product={product} selectedColor={selectedColor} handleColorChange={handleColorChange} getColorStyle={getColorStyle} />
      </div>
    </div>
  );
}
