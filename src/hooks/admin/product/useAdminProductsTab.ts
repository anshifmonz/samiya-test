import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type Product } from 'types/product';
import { useAdminProductInfiniteScroll } from 'hooks/admin/product/useAdminProductInfiniteScroll';
import { apiRequest } from 'utils/apiRequest';
import { showToast } from 'hooks/ui/use-toast';
import { useConfirmation } from 'hooks/useConfirmation';
import { useSizes } from 'hooks/admin/product/useSizes';

interface UseAdminProductsTabProps {
  initialProducts: Product[];
}

export const useAdminProductsTab = ({ initialProducts }: UseAdminProductsTabProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortOption, setSortOption] = useState<Record<string, string>>({
    sort: searchParams.get('sort_by') || 'last-updated'
  });
  const [stockFilter, setStockFilter] = useState<string | null>(searchParams.get('stock_filter'));
  const { sizes } = useSizes();
  const confirmation = useConfirmation();

  const { products, loading, hasMore, error, loaderRef, refreshProducts, isSearching } =
    useAdminProductInfiniteScroll(initialProducts, searchQuery, sortOption, stockFilter);

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const { error } = await apiRequest('/api/admin/product', {
      method: 'POST',
      body: newProduct,
      showLoadingBar: true
    });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product added successfully' });
    setShowAddForm(false);
    refreshProducts();
    return true;
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    const { error } = await apiRequest('/api/admin/product', {
      method: 'PUT',
      body: updatedProduct,
      showLoadingBar: true
    });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product updated successfully' });
    setEditingProduct(null);
    refreshProducts();
    return true;
  };

  const handleDeleteProduct = async (productId: string, productTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete the product${
        productTitle ? ` "${productTitle}"` : ''
      }? This action cannot be undone and will remove all associated images and data.`,
      confirmText: 'Delete Product',
      cancelText: 'Cancel',
      variant: 'destructive'
    });

    if (!confirmed) return false;

    const { error } = await apiRequest(`/api/admin/product?id=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      showLoadingBar: true
    });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return false;
    }
    showToast({ title: 'Success', description: 'Product deleted successfully' });
    refreshProducts();
    return true;
  };

  const handleShowAddForm = () => setShowAddForm(true);
  const handleHideAddForm = () => setShowAddForm(false);
  const handleStartEditing = (product: Product) => setEditingProduct(product);
  const handleStopEditing = () => setEditingProduct(null);

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateUrlParams({ q: query || null });
  };

  const updateUrlParams = (paramsToUpdate: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    setSortOption({ sort });
    updateUrlParams({ sort_by: sort === 'last-updated' ? null : sort });
  };

  const handleStockFilterChange = (filter: string) => {
    const newFilter = filter === 'all' ? null : filter;
    setStockFilter(newFilter);
    updateUrlParams({ stock_filter: newFilter });
  };

  const isFormVisible = showAddForm || !!editingProduct;
  const currentProduct = editingProduct;
  const productsCount = products.length;
  const productsCountText = `${productsCount} product${productsCount !== 1 ? 's' : ''} found${
    searchQuery ? ` for "${searchQuery}"` : ''
  }`;

  return {
    // State
    searchQuery,
    showAddForm,
    editingProduct,
    products,
    loading,
    hasMore,
    error,
    isSearching,
    sortOption,
    stockFilter,
    sizes,

    // Refs
    loaderRef,

    // Handlers
    handleSearchChange,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleShowAddForm,
    handleHideAddForm,
    handleStartEditing,
    handleStopEditing,
    handleCancelForm,
    handleSortChange,
    handleStockFilterChange,

    // Computed values
    isFormVisible,
    currentProduct,
    productsCountText,

    // Utility functions
    refreshProducts,

    // Confirmation dialog state
    confirmation
  };
};
