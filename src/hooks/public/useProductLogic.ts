'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Product, type Size } from 'types/product';

export function useProductLogic(product: Product) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstColor = Object.keys(product.images)[0];

  const [selectedColor, setSelectedColor] = useState<string>(() => searchParams?.get('color') || firstColor);
  const [selectedSize, setSelectedSize] = useState<string>(() => searchParams?.get('size') || '');
  const [selectedSizeData, setSelectedSizeData] = useState<Size | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);

  const updateUrlParams = useCallback((color: string, size: string = '') => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    current.set('color', color);
    if (size) {
      current.set('size', size);
    } else {
      current.delete('size');
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  }, [router, searchParams]);

  const isSizeOutOfStock = useCallback((sizeData?: Size) => {
    return sizeData?.stock_quantity === 0;
  }, []);

  const getAvailableSizesForColor = useCallback((colorName: string): Size[] => {
    if (product.colorSizes?.[colorName]?.length > 0) return product.colorSizes[colorName];
    if (product.images[colorName]?.sizes?.length > 0) return product.images[colorName].sizes!;
    return product.sizes || [];
  }, [product]);

  useEffect(() => {
    const colorFromUrl = searchParams?.get('color');
    const sizeFromUrl = searchParams?.get('size') || '';

    if (!colorFromUrl) {
      const availableSizes = getAvailableSizesForColor(firstColor);
      const firstValidSize = availableSizes.find(size => !isSizeOutOfStock(size));
      const initialSize = firstValidSize ? firstValidSize.name : '';
      updateUrlParams(firstColor, initialSize);
    } else {
      const availableSizes = getAvailableSizesForColor(colorFromUrl);
      const currentSizeData = availableSizes.find(size => size.name === sizeFromUrl);
      setSelectedColor(colorFromUrl);
      setSelectedSize(sizeFromUrl);
      setSelectedSizeData(currentSizeData);

      if (currentSizeData && isSizeOutOfStock(currentSizeData))
        updateUrlParams(colorFromUrl, '');
    }
  }, [searchParams, firstColor, product, getAvailableSizesForColor, isSizeOutOfStock, updateUrlParams]);

  const handleColorChange = (color: string) => {
    const availableSizes = getAvailableSizesForColor(color);
    const firstValidSize = availableSizes.find(size => !isSizeOutOfStock(size));
    const newSize = firstValidSize ? firstValidSize.name : '';
    setSelectedColor(color);
    setSelectedSize(newSize);
    updateUrlParams(color, newSize);
  };

  const handleSizeChange = (sizeName: string, sizeData?: Size) => {
    if (sizeData && !isSizeOutOfStock(sizeData)) {
      setSelectedSize(sizeName);
      updateUrlParams(selectedColor, sizeName);
    } else {
      setSelectedSize('');
      updateUrlParams(selectedColor, '');
    }
  };

  const handleWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const message =
      `Hello, I'm interested in this product!\n` +
      `*Product ID:* ${product.short_code}\n` +
      `*Title:* ${product.title}\n` +
      `*Color:* ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}\n` +
      `*Size:* ${selectedSize || 'N/A'}\n` +
      `*Quantity:* ${quantity}\n` +
      `\n*Price:* ₹${product.price.toLocaleString()}\n` +
      (url ? `*Link:* ${url}` : '');
    const whatsappUrl = `https://wa.me/+919562700999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getColorStyle = (color: string) => {
    const colorData = product.images[color];
    if (colorData?.hex && colorData.hex !== '######') return colorData.hex;

    const colorMap: Record<string, string> = {
      red: '#DC2626', blue: '#2563EB', green: '#16A34A', white: '#FFFFFF', cream: '#F5F5DC',
      navy: '#000080', pink: '#EC4899', yellow: '#EAB308', purple: '#9333EA', black: '#000000',
      emerald: '#059669', maroon: '#7C2D12', gold: '#D97706', burgundy: '#7C2D12', beige: '#F5F5DC',
      olive: '#808000', offwhite: '#FAF0E6', grey: '#808080', charcoal: '#36454F',
      midnight: '#191970', light: '#ADD8E6', dark: '#006400', peach: '#FFCBA4', lavender: '#E6E6FA', mint: '#98FB98'
    };
    return colorMap[color] || color;
  };

  return {
    selectedColor,
    selectedSize,
    selectedSizeData,
    quantity,
    handleColorChange,
    handleSizeChange,
    setQuantity,
    handleWhatsApp,
    getColorStyle
  };
}
