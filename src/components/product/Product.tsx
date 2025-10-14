'use client';

import ProductHeader from './Header';
import ProductPricing from './Pricing';
import ProductActions from './Actions';
import StockStatus from './StockStatus';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import ArchivedLabel from './ArchivedLabel';
import ProductImageGallery from './ImageGallery';
import QuantitySelector from './QuantitySelector';
import { ProductProvider, useProductContext } from 'contexts/ProductContext';
import { type Product } from 'types/product';

function ProductPageContent() {
  const { isArchive } = useProductContext();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImageGallery />
          <div className="flex flex-col gap-4 justify-center">
            <ProductHeader />
            <ProductPricing />
            {!isArchive && <StockStatus />}
            <ColorSelector />
            <SizeSelector />
            <QuantitySelector />
            {isArchive ? <ArchivedLabel /> : <ProductActions />}
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductPage({ product }: { product: Product }) {
  return (
    <ProductProvider product={product}>
      <ProductPageContent />
    </ProductProvider>
  );
}

export default ProductPage;
