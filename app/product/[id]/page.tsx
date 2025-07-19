import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import SimilarProducts from 'components/product/SimilarProducts';
import ProductPage from 'components/product/Product';
import getProduct from 'lib/public/product';
import { type Product } from 'types/product';
import similarProducts from 'lib/public/similarProducts';

export const revalidate = 600;

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const product: Product | null = await getProduct(id);
  const similarProductsData = await similarProducts(id, 8, 0);
  if (!product) notFound();
  const firstColor = Object.keys(product.images)[0];

    return (
    <>
      <ProductPage product={product} initialColor={firstColor} />
      <SimilarProducts productId={id} initialProducts={similarProductsData || []} />
    </>
  );
}
