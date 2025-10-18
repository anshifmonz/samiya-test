import { useState, useRef, useCallback, useEffect } from 'react';
import { apiRequest } from 'lib/utils/apiRequest';
import { type Product } from 'types/product';
import { useDebounce } from 'hooks/ui/useDebounce';

const PAGE_SIZE = 16;
const DEBOUNCE_DELAY = 500; // 500ms delay

function buildAdminProductSearchParams(
  query?: string,
  limit: number = PAGE_SIZE,
  offset: number = 0,
  sort?: Record<string, string>,
  stock_filter?: string | null
) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (sort && sort.sort !== 'relevance') params.set('sort_by', sort.sort);
  if (stock_filter) params.set('stock_filter', stock_filter);
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());
  return params;
}

export function useAdminProductInfiniteScroll(
  initialProducts: Product[],
  searchQuery?: string,
  sortOption?: Record<string, string>,
  stockFilter?: string | null
) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialProducts.length);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const fetchMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const params = buildAdminProductSearchParams(
        debouncedQuery,
        PAGE_SIZE,
        offset,
        sortOption,
        stockFilter
      );
      const res = await apiRequest(`/api/admin/product?${params.toString()}`, {
        showLoadingBar: true,
        loadingBarDelay: 200
      });
      if (res.error) throw new Error(res.error);
      const newProducts = res.data?.products || [];

      setProducts(prev => [...prev, ...newProducts]);
      setOffset(prev => prev + newProducts.length);
      setHasMore(newProducts.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, sortOption, offset, loading, hasMore, stockFilter]);

  useEffect(() => {
    let ignore = false;

    async function fetchFirstPage() {
      setLoading(true);
      setHasMore(true);
      setOffset(0);
      setError(null);

      try {
        const params = buildAdminProductSearchParams(
          debouncedQuery,
          PAGE_SIZE,
          0,
          sortOption,
          stockFilter
        );
        const res = await apiRequest(`/api/admin/product?${params.toString()}`, {
          showLoadingBar: true,
          loadingBarDelay: 150
        });
        if (res.error) throw new Error(res.error);
        const newProducts = res.data?.products || [];

        if (!ignore) {
          setProducts(newProducts);
          setOffset(newProducts.length);
          setHasMore(newProducts.length === PAGE_SIZE);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setHasMore(false);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchFirstPage();
    return () => {
      ignore = true;
    };
  }, [debouncedQuery, sortOption, stockFilter]);

  // intersection observer to trigger fetchMoreProducts
  useEffect(() => {
    if (!hasMore) return;

    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) observer.observe(currentLoaderRef);

    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [fetchMoreProducts, hasMore]);

  // refresh products after add/edit/delete operations
  const refreshProducts = useCallback(async () => {
    setLoading(true);
    setHasMore(true);
    setOffset(0);
    setError(null);

    try {
      const params = buildAdminProductSearchParams(
        debouncedQuery,
        PAGE_SIZE,
        0,
        sortOption,
        stockFilter
      );
      const res = await apiRequest(`/api/admin/product?${params.toString()}`, {
        showLoadingBar: true,
        loadingBarDelay: 150
      });
      if (res.error) throw new Error(res.error);
      const newProducts = res.data?.products || [];

      setProducts(newProducts);
      setOffset(newProducts.length);
      setHasMore(newProducts.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, sortOption, stockFilter]);

  return {
    products,
    loading,
    hasMore,
    error,
    loaderRef,
    refreshProducts,
    isSearching: searchQuery !== debouncedQuery // indicates if search is in progress
  };
}
