import { useState } from 'react';
import { type Product } from 'types/product';
import { useAdminProductInfiniteScroll } from 'hooks/admin/product/useAdminProductInfiniteScroll';
import { apiRequest } from 'utils/apiRequest';
import { showToast } from 'hooks/ui/use-toast';
import { useConfirmation } from 'hooks/useConfirmation';

interface UseAdminProductsTabProps {
  initialProducts: Product[];
  sortOption: string;
}

export const useAdminProductsTab = ({
  initialProducts,
  sortOption
}: UseAdminProductsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    products,
    loading,
    hasMore,
    error,
    loaderRef,
    refreshProducts,
    isSearching
  } = useAdminProductInfiniteScroll(initialProducts, searchQuery, sortOption);
  const confirmation = useConfirmation();
  // Product operation handlers
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const { data, error } = await apiRequest('/api/admin/product', { method: 'POST', body: newProduct, showLoadingBar: true });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product added successfully' });
    setShowAddForm(false);
    refreshProducts();
    return data;
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    const { data, error } = await apiRequest('/api/admin/product', { method: 'PUT', body: updatedProduct, showLoadingBar: true });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product updated successfully' });
    setEditingProduct(null);
    refreshProducts();
    return data;
  };

  const handleDeleteProduct = async (productId: string, productTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete the product${productTitle ? ` "${productTitle}"` : ''}? This action cannot be undone and will remove all associated images and data.`,
      confirmText: 'Delete Product',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return false;

    const { error } = await apiRequest(`/api/admin/product?id=${encodeURIComponent(productId)}`, { method: 'DELETE', showLoadingBar: true });
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
  };

  const isFormVisible = showAddForm || !!editingProduct;
  const currentProduct = editingProduct;
  const productsCount = products.length;
  const productsCountText = `${productsCount} product${productsCount !== 1 ? 's' : ''} found${searchQuery ? ` for "${searchQuery}"` : ''}`;

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

    // Computed values
    isFormVisible,
    currentProduct,
    productsCountText,

    // Utility functions
    refreshProducts
  };
};
