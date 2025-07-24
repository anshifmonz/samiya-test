import { useState, useRef, useCallback, useEffect } from 'react';
import { apiRequest } from 'lib/utils/apiRequest';
import { SearchProduct, type ProductFilters } from 'types/product';

const PAGE_SIZE = 16;

function buildProductSearchParams(query?: string, filters?: ProductFilters, limit: number = PAGE_SIZE, offset: number = 0) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (filters?.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters?.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
  if (filters?.colors && filters.colors.length > 0) params.set('colors', filters.colors.join(','));
  if (filters?.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  if (filters?.sortOrder && filters.sortOrder !== 'relevance') params.set('sortOrder', filters.sortOrder);
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());
  return params;
}

export function useInfiniteProductScroll(initialProducts: SearchProduct[], initialTotalCount: number, query?: string, filters?: ProductFilters) {
  const [products, setProducts] = useState(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialProducts.length);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // fetch more products
  const fetchMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = buildProductSearchParams(query, filters, PAGE_SIZE, offset);
      const res = await apiRequest(`/api/search?${params.toString()}`, { showLoadingBar: true, loadingBarDelay: 200 });
      if (res.error) throw new Error(res.error);
      const newProducts: SearchProduct[] = res.data?.products || res.data || [];
      setProducts(prev => [...prev, ...newProducts]);
      setOffset(prev => prev + newProducts.length);
      if (newProducts.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [query, filters, offset, loading, hasMore]);

  // reset products and fetch first page if filters or query change
  useEffect(() => {
    if (isFirstRender && initialProducts.length > 0) {
      setIsFirstRender(false);
      return;
    }

    let ignore = false;
    async function fetchFirstPage() {
      setLoading(true);
      setHasMore(true);
      setOffset(0);
      try {
        const params = buildProductSearchParams(query, filters, PAGE_SIZE, 0);
        const res = await apiRequest(`/api/search?${params.toString()}`, { showLoadingBar: true, loadingBarDelay: 200 });
        if (res.error) throw new Error(res.error);
        const responseData = res.data;
        const newProducts: SearchProduct[] = responseData?.products || [];
        const newTotalCount = responseData?.totalCount || newProducts.length;
        if (!ignore) {
          setProducts(newProducts);
          setTotalCount(newTotalCount);
          setOffset(newProducts.length);
          setHasMore(newProducts.length === PAGE_SIZE);
        }
      } catch (e) {
        if (!ignore) setHasMore(false);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchFirstPage();
    setIsFirstRender(false);
    return () => { ignore = true; };
  }, [filters, query, isFirstRender, initialProducts.length]);

  // Intersection Observer to trigger fetchMoreProducts
  useEffect(() => {
    if (!hasMore) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreProducts();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchMoreProducts, hasMore]);

  return { products, totalCount, loading, hasMore, loaderRef };
}
