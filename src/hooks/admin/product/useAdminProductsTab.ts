import { useState } from 'react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import { useAdminProductInfiniteScroll } from 'hooks/admin/product/useAdminProductInfiniteScroll';

interface UseAdminProductsTabProps {
  initialProducts: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  onEditProduct: (product: Product) => Promise<Product | null>;
  onDeleteProduct: (productId: string, productTitle?: string) => Promise<boolean>;
  sortOption: string;
}

export const useAdminProductsTab = ({
  initialProducts,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
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

  // Product operation handlers
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const product = await onAddProduct(newProduct);
    if (!product) return;
    setShowAddForm(false);
    refreshProducts();
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    const product = await onEditProduct(updatedProduct);
    if (!product) return;
    setEditingProduct(null);
    refreshProducts();
  };

  const handleDeleteProduct = async (productId: string, productTitle?: string) => {
    const result = await onDeleteProduct(productId, productTitle);
    if (!result) return;
    refreshProducts();
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
