'use client';

import { useState, FC } from 'react';
import { apiRequest } from 'utils/apiRequest';
import ProductCardSection from 'components/shared/ProductCardSection';
import type { SectionWithProducts, SectionProduct } from 'types/collection';

const ProductsGridClient: FC<{ section: SectionWithProducts }> = ({ section }) => {
  const [products, setProducts] = useState<SectionProduct[]>(section.products);
  const [offset, setOffset] = useState<number>(section.products.length);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await apiRequest(
        `/api/section-products/${section.id}?limit=12&offset=${offset}`,
        {
          showLoadingBar: true
        }
      );
      const newProducts = data?.data?.products || [];
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setOffset(prev => prev + newProducts.length);
      }
    } catch (_) {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="py-28 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-4 tracking-[0.3em]">
              Trending Now
            </span>
            <h2 className="luxury-heading text-5xl sm:text-6xl text-luxury-black mb-8">
              {section.title}
            </h2>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              {section.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              className="animate-fade-in-up"
            >
              <ProductCardSection product={product} />
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={fetchMoreProducts}
              className="luxury-btn-primary px-8 py-3 rounded-full text-lg font-light tracking-wide"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsGridClient;
