import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Plus } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import Image from 'next/image';
import { useDebounce } from 'hooks/ui/useDebounce';

type ModalProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (productId: string) => void;
  existingProductIds: string[];
}

const DEBOUNCE_DELAY = 500;
const PAGE_SIZE = 16;

function buildProductSearchParams(query?: string, limit: number = PAGE_SIZE, offset: number = 0) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());
  return params;
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
  isOpen,
  onClose,
  onProductSelect,
  existingProductIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ModalProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchFirstPage();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsSearching(searchQuery !== debouncedQuery);
      if (debouncedQuery !== undefined) {
        fetchFirstPage();
      }
    }
  }, [debouncedQuery, isOpen]);


  const fetchFirstPage = useCallback(async () => {
    let ignore = false;

    setLoading(true);
    setHasMore(true);
    setOffset(0);
    setError(null);

    try {
      const params = buildProductSearchParams(debouncedQuery, PAGE_SIZE, 0);
      const res = await fetch(`/api/admin/section/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const { products: newProducts } = await res.json();

      if (!ignore) {
        setProducts(Array.isArray(newProducts) ? newProducts : []);
        setOffset(Array.isArray(newProducts) ? newProducts.length : 0);
        setHasMore(Array.isArray(newProducts) ? newProducts.length === PAGE_SIZE : false);
      }
    } catch (err) {
      if (!ignore) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setHasMore(false);
        setProducts([]);
      }
    } finally {
      if (!ignore) {
        setLoading(false);
        setIsSearching(false);
      }
    }

    return () => { ignore = true; };
  }, [debouncedQuery]);

  const fetchMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const params = buildProductSearchParams(debouncedQuery, PAGE_SIZE, offset);
      const res = await fetch(`/api/admin/section/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const { products: newProducts } = await res.json();

      setProducts(prev => Array.isArray(newProducts) ? [...prev, ...newProducts] : prev);
      setOffset(prev => Array.isArray(newProducts) ? prev + newProducts.length : prev);
      setHasMore(Array.isArray(newProducts) ? newProducts.length === PAGE_SIZE : false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, offset, loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchMoreProducts, hasMore]);

  const handleProductSelect = (productId: string) => onProductSelect(productId);

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between">
          <h2 className="luxury-heading text-2xl text-luxury-black">
            Add Products to Section
          </h2>
          <button
            onClick={onClose}
            className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex-shrink-0 p-6 border-b border-luxury-gray/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray" size={20} />
            <Input
              placeholder="Search products by name, ID, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-luxury-gray/30 focus:border-luxury-gold"
              autoFocus
            />
          </div>
          {isSearching && (
            <div className="flex items-center space-x-2 text-luxury-gray mt-2">
              <Search size={14} className="animate-pulse" />
              <span className="text-sm">Searching...</span>
            </div>
          )}
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
            {loading && products.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
                <p className="luxury-body text-luxury-gray mt-4">Loading products...</p>
              </div>
            ) : products.filter(product => !existingProductIds.includes(product.id)).length === 0 ? (
              <div className="text-center py-12 text-luxury-gray">
                <p className="luxury-body text-lg">
                  {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                </p>
                <p className="luxury-body text-sm mt-2">
                  {searchQuery ? 'Try a different search term.' : 'All products may already be added to this section.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.filter(product => !existingProductIds.includes(product.id)).map((product) => {
                  const imageUrl = product.imageUrl;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border border-luxury-gray/20 rounded-lg hover:bg-luxury-cream/30 transition-colors duration-200"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-luxury-gray/10 flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            width={100}
                            height={100}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center hidden">
                          <svg className="w-6 h-6 text-luxury-gray/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="luxury-heading text-lg text-luxury-black truncate">
                          {product.title}
                        </h4>
                        <p className="luxury-body text-luxury-gold font-semibold">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Add Button */}
                      <Button
                        onClick={() => handleProductSelect(product.id)}
                        size="sm"
                        className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black px-3 py-1 rounded-lg flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Add
                      </Button>
                    </div>
                  );
                })}

                {/* Infinite Scroll Loader */}
                {hasMore && (
                  <div ref={loaderRef} className="py-4">
                    {loading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-gold mx-auto"></div>
                        <p className="luxury-body text-luxury-gray text-sm mt-2">Loading more products...</p>
                      </div>
                    ) : (
                      <div className="h-4" /> // Invisible spacer to trigger intersection observer
                    )}
                  </div>
                )}

                {/* End of results indicator */}
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-4 text-luxury-gray">
                    <p className="luxury-body text-sm">No more products to load</p>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="text-center py-4 text-red-500">
                    <p className="luxury-body text-sm">Error loading products: {error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return mounted && isOpen ? createPortal(modalContent, document.body) : null;
};

export default ProductSearchModal;
