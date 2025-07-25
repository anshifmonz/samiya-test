import { type Product } from 'types/product';
import { createContext, useContext } from 'react';
import { useAdminProductsTab } from 'hooks/admin/product/useAdminProductsTab';
import { type Category } from 'types/category';
import { ConfirmationDialog } from 'ui/confirmation-dialog';

interface ProductsTabProviderProps {
  children: React.ReactNode;
  initialProducts: Product[];
  categories: Category[];
  sortOption: string;
  isSuperAdmin: boolean;
}

interface ProductsTabContextType {
    isSuperAdmin: boolean;
    categories: Category[];
    searchQuery: string;
    showAddForm: boolean;
    editingProduct: Product | null;
    products: Product[];
    loading: boolean;
    hasMore: boolean;
    error: string | null;
    isSearching: boolean;

    // Refs
    loaderRef: React.RefObject<HTMLDivElement>;

    // Handlers
    handleSearchChange: (query: string) => void;
    handleAddProduct: (product: Product) => void;
    handleEditProduct: (product: Product) => void;
    handleDeleteProduct: (productId: string, productTitle?: string) => Promise<boolean>;
    handleShowAddForm: () => void;
    handleHideAddForm: () => void;
    handleStartEditing: (product: Product) => void;
    handleStopEditing: () => void;
    handleCancelForm: () => void;

    // Computed values
    isFormVisible: boolean;
    currentProduct: Product | null;
    productsCountText: string;

    // Utility functions
    refreshProducts: () => void;
}

const ProductsTabContext = createContext<ProductsTabContextType | undefined>(undefined);

export const ProductsTabProvider = ({ children, initialProducts, categories, sortOption, isSuperAdmin }: ProductsTabProviderProps) => {
  const adminProductsTab = useAdminProductsTab({ initialProducts, sortOption });
  return (
    <ProductsTabContext.Provider value={{isSuperAdmin, categories, ...adminProductsTab}}>
      {children}
      {adminProductsTab.confirmation && (
        <ConfirmationDialog
          isOpen={adminProductsTab.confirmation.isOpen}
          onClose={adminProductsTab.confirmation.hideConfirmation}
          onConfirm={adminProductsTab.confirmation.onConfirm || (() => {})}
          title={adminProductsTab.confirmation.title}
          message={adminProductsTab.confirmation.message}
          confirmText={adminProductsTab.confirmation.confirmText}
          cancelText={adminProductsTab.confirmation.cancelText}
          variant={adminProductsTab.confirmation.variant}
          isLoading={adminProductsTab.confirmation.isLoading}
        />
      )}
    </ProductsTabContext.Provider>
  );
};

export const useProductsTab = () => {
  const context = useContext(ProductsTabContext);
  if (!context) {
    throw new Error('useProductsTab must be used within a ProductsTabProvider');
  }
  return context;
};
