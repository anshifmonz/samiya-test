import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Plus } from 'lucide-react';
import { type Product } from '@/types/product';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import Image from 'next/image';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (productId: string) => void;
  existingProductIds: string[];
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
  isOpen,
  onClose,
  onProductSelect,
  existingProductIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchProducts();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !existingProductIds.includes(product.id)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products.filter(product => !existingProductIds.includes(product.id)));
    }
  }, [searchQuery, products, existingProductIds]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/product');
      if (response.ok) {
        const { products } = await response.json();
        setProducts(products || []);
      } else {
        console.error('Failed to fetch products:', response.statusText);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    onProductSelect(productId);
    onClose();
  };

  const getFirstImage = (images: Record<string, string[]>) => {
    if (!images || typeof images !== 'object') return '';
    const firstColor = Object.keys(images)[0];
    return firstColor && images[firstColor] && images[firstColor][0] ? images[firstColor][0] : '';
  };

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between z-[9999]">
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
        <div className="p-6 border-b border-luxury-gray/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray" size={20} />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-luxury-gray/30 focus:border-luxury-gold"
              autoFocus
            />
          </div>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
              <p className="luxury-body text-luxury-gray mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
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
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border border-luxury-gray/20 rounded-lg hover:bg-luxury-cream/30 transition-colors duration-200"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-luxury-gray/10 flex-shrink-0">
                    {getFirstImage(product.images) ? (
                      <Image
                        src={getFirstImage(product.images)}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                        onError={(e) => {
                          // Fallback to placeholder on error
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return mounted && isOpen ? createPortal(modalContent, document.body) : null;
};

export default ProductSearchModal;
