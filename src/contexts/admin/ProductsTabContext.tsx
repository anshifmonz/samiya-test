import { type Product } from 'types/product';
import { createContext, useContext } from 'react';
import { useAdminProductsTab } from 'hooks/admin/product/useAdminProductsTab';
import { type Category } from 'types/category';
import { type Size } from 'types/product';
import { ConfirmationDialog } from 'ui/confirmation-dialog';

interface ProductsTabProviderProps {
  children: React.ReactNode;
  initialProducts: Product[];
  categories: Category[];
}

interface ProductsTabContextType {
  categories: Category[];
  sortOption: Record<string, string>;
  searchQuery: string;
  stockFilter: string | null;
  showAddForm: boolean;
  editingProduct: Product | null;
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  isSearching: boolean;
  sizes: Size[];

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
  handleSortChange: (sort: string) => void;
  handleStockFilterChange: (filter: string) => void;

  // Computed values
  isFormVisible: boolean;
  currentProduct: Product | null;
  productsCountText: string;

  // Utility functions
  refreshProducts: () => void;
}

const ProductsTabContext = createContext<ProductsTabContextType | undefined>(undefined);

export const ProductsTabProvider = ({
  children,
  initialProducts,
  categories
}: ProductsTabProviderProps) => {
  const adminProductsTab = useAdminProductsTab({ initialProducts });
  return (
    <ProductsTabContext.Provider value={{ categories, ...adminProductsTab }}>
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
