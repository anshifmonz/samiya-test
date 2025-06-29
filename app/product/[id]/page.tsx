"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, getProductById, products } from '@/data/products';
import Navigation from '@/components/shared/Navigation';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductDetails from '@/components/product/ProductDetails';
import ProductColorSwatches from '@/components/product/ProductColorSwatches';
import SimilarProducts from '@/components/product/SimilarProducts';
import ProductNotFound from '@/components/product/ProductNotFound';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        const firstColor = Object.keys(foundProduct.images)[0];
        setSelectedColor(firstColor);

        // Get similar products from the same category, excluding the current product
        const similar = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setSimilarProducts(similar);
      }
      setLoading(false);
    }
  }, [id]);

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
      burgundy: '#7C2D12'
    };
    return colorMap[color] || color;
  };

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  if (!product) {
    return <ProductNotFound onGoHome={() => router.push('/')} />;
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="luxury-card rounded-3xl overflow-hidden border border-luxury-gray/10 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <ProductImageGallery product={product} selectedColor={selectedColor} />
            <ProductDetails product={product} />
          </div>
          <ProductColorSwatches
            product={product}
            selectedColor={selectedColor}
            handleColorChange={handleColorChange}
            getColorStyle={getColorStyle}
          />
        </div>
        <SimilarProducts similarProducts={similarProducts} />
      </div>
    </div>
  );
}
