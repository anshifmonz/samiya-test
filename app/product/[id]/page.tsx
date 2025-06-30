import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import Navigation from 'components/shared/Navigation';
import SimilarProducts from 'components/product/SimilarProducts';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import ProductClient from './ProductClient';
import { getProductById } from '@/lib/api';

interface Props {
  params: {
    id: string;
  };
}

// Generate static params for all products (if using static generation)
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { product, similarProducts } = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const firstColor = Object.keys(product.images)[0];

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <Suspense fallback={<LoadingSpinner text="Loading product details..." />}>
          <div className="luxury-card rounded-3xl overflow-hidden border border-luxury-gray/10 p-8 lg:p-12">
            <ProductClient
              product={product}
              initialColor={firstColor}
            />
          </div>
          <SimilarProducts similarProducts={similarProducts} />
        </Suspense>
      </div>
    </div>
  );
}
