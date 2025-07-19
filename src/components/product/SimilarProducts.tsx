'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SimilarProductCard from './SimilarProductCard';
import { type SimilarProduct } from 'types/product';
import { Button } from 'ui/button';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface SimilarProductsProps {
  productId: string;
  initialProducts?: SimilarProduct[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  productId,
  initialProducts = []
}) => {
  const [products, setProducts] = useState<SimilarProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialProducts.length);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 8;

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/similar-products?id=${productId}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
      );

      if (!response.ok)
        throw new Error('Failed to load similar products');

      const newProducts = await response.json();

      if (newProducts && newProducts.length > 0) {
        setProducts(prev => [...prev, ...newProducts]);
        setOffset(prev => prev + newProducts.length);
        setHasMore(newProducts.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading similar products:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, offset, loading, hasMore]);

  useEffect(() => {
    if (initialProducts.length === 0) {
      loadMoreProducts();
    }
  }, []);

  if (products.length === 0 && !loading && !error) {
    return null;
  }

  return (
    <div className="mt-[150px] px-16">
      <h2 className="luxury-heading text-3xl text-luxury-black mb-8 text-center">
        Similar Products
      </h2>

      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {products.map(product => (
          <SimilarProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMoreProducts}
            disabled={loading}
            variant="outline"
            className="px-8 py-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No more similar products available
        </div>
      )}

      {loading && products.length === 0 && (
        <div className="flex justify-center mt-8">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
