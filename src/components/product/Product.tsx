'use client';

import { Suspense } from 'react';
import { type Product } from 'types/product';
import { ProductProvider } from 'contexts/ProductContext';
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

function ProductPage({ product }: Props) {
  return (
    <ProductProvider product={product}>
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Suspense fallback={<LoadingSpinner text="Loading product details..." />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProductImageGallery />
              <div className="flex flex-col gap-4 justify-center">
                <ProductHeader />
                <ProductPricing />
                <StockStatus />
                <ColorSelector />
                <SizeSelector />
                <QuantitySelector />
                <ProductActions />
              </div>
            </div>
          </Suspense>
        </main>
      </div>
    </ProductProvider>
  );
}

export default ProductPage;
