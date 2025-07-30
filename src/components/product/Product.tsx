'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Product, type Size } from 'types/product';
import ProductImageGallery from './ImageGallery';
import ProductHeader from './Header';
import ProductPricing from './Pricing';
import StockStatus from './StockStatus';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './Actions';
import LoadingSpinner from 'components/shared/LoadingSpinner';

interface Props {
  product: Product;
}

export default function ProductPage({ product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstColor = Object.keys(product.images)[0];

  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return searchParams?.get('color') || firstColor;
  });
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return searchParams?.get('size') || '';
  });

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
    return sizeData && sizeData.stock_quantity !== undefined && sizeData.stock_quantity === 0;
  }, []);

  // Helper function to get available sizes for a specific color
  const getAvailableSizesForColor = useCallback((colorName: string) => {
    // Check if the selected color has specific sizes in colorSizes
    if (product.colorSizes && product.colorSizes[colorName] && product.colorSizes[colorName].length > 0)
      return product.colorSizes[colorName];

    // Check if the color data itself has sizes (from images object)
    if (product.images[colorName]?.sizes && product.images[colorName].sizes!.length > 0)
      return product.images[colorName].sizes!;

    // fall back to global product sizes
    return product.sizes || [];
  }, [product.colorSizes, product.images, product.sizes]);

  useEffect(() => {
    // Initialize and sync state from URL
    const colorFromUrl = searchParams?.get('color');
    const sizeFromUrl = searchParams?.get('size') || '';

    // If no color parameter in URL, use first color and sync to URL
    if (!colorFromUrl) {
      setSelectedColor(firstColor);

      // Auto-select first valid size for the first color
      const availableSizes = getAvailableSizesForColor(firstColor);
      const firstValidSize = availableSizes.find(size => !isSizeOutOfStock(size));
      const initialSize = firstValidSize ? firstValidSize.name : '';

      setSelectedSize(initialSize);
      setSelectedSizeData(firstValidSize);

      updateUrlParams(firstColor, initialSize);
    } else {
      // Color parameter exists in URL
      setSelectedColor(colorFromUrl);
      setSelectedSize(sizeFromUrl);

      // Update size data based on the selected color and size
      const availableSizes = getAvailableSizesForColor(colorFromUrl);
      const currentSizeData = availableSizes.find(size => size.name === sizeFromUrl);

      setSelectedSizeData(currentSizeData);

      // If size is out of stock, remove from URL
      if (currentSizeData && isSizeOutOfStock(currentSizeData)) {
        updateUrlParams(colorFromUrl, '');
      }
    }
  }, [searchParams, firstColor, getAvailableSizesForColor, isSizeOutOfStock, updateUrlParams]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    // Reset size when color changes
    const availableSizes = getAvailableSizesForColor(color);
    const firstValidSize = availableSizes.find(size => !isSizeOutOfStock(size));
    const newSize = firstValidSize ? firstValidSize.name : '';

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

  const getColorStyle = (color: string) => {
    const colorData = product.images[color];
    if (colorData?.hex && colorData.hex !== '######') {
      return colorData.hex;
    }

    // legacy support
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

  const handleWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const message =
      `Hello, I'm interested in this product!%0A` +
      `*Product ID:* ${product.short_code}%0A` +
      `*Title:* ${product.title}%0A` +
      `*Color:* ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}%0A` +
      `*Size:* ${selectedSize ? selectedSize : 'N/A'}%0A` +
      `*Quantity:* ${quantity}%0A` +
      `%0A*Price:* ₹${product.price.toLocaleString()}%0A` +
      (url ? `*Link:* ${url}` : '');
    const whatsappUrl = `https://wa.me/+919562700999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <Suspense fallback={<LoadingSpinner text="Loading product details..." />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductImageGallery product={product} selectedColor={selectedColor} />

            <div className="flex flex-col gap-4 justify-center">
              <ProductHeader product={product} />

              <ProductPricing product={product} />

              <StockStatus selectedSize={selectedSizeData} />

              <ColorSelector
                product={product}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                getColorStyle={getColorStyle}
              />

              <SizeSelector
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              <ProductActions
                onBuyNow={handleWhatsApp}
              />
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
