import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import SimilarProducts from 'components/product/SimilarProducts';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import ProductClient from './ProductClient';
import getProduct from 'lib/public/product';
import { type Product } from 'types/product';

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const product: Product | null = await getProduct(id);
  if (!product) notFound();
  const firstColor = Object.keys(product.images)[0];

  return (
    <div className="min-h-screen bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <Suspense fallback={<LoadingSpinner text="Loading product details..." />}>
          <ProductClient
            product={product}
            initialColor={firstColor}
          />
          {/* <SimilarProducts similarProducts={similarProducts} /> */}
        </Suspense>
      </div>
    </div>
  );
}
