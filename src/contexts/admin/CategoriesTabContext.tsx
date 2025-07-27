import { createContext, useContext } from 'react';
import { useAdminCategoriesTab } from 'hooks/admin/category/useAdminCategoriesTab';
import { type Category } from 'types/category';
import { ConfirmationDialog } from 'ui/confirmation-dialog';

interface CategoriesTabProviderProps {
  children: React.ReactNode;
  initialCategories: Category[];
}

interface CategoriesTabContextType {
  // State
  searchQuery: string;
  showAddForm: boolean;
  editingCategory: Category | null;
  filteredCategories: Category[];
  categoryList: Category[];
  confirmation: any;

  // Handlers
  handleSearchChange: (query: string) => void;
  handleAddCategory: (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleEditCategory: (updatedCategoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleDeleteCategory: (categoryId: string, categoryName: string) => Promise<void>;
  handleShowAddForm: () => void;
  handleHideAddForm: () => void;
  handleStartEditing: (category: Category) => void;
  handleStopEditing: () => void;
  handleCancelForm: () => void;
  fetchCategories: () => Promise<void>;

  // Computed values
  isFormVisible: boolean;
  currentCategory: Category | null;
  categoriesCountText: string;
}

const CategoriesTabContext = createContext<CategoriesTabContextType | undefined>(undefined);

export const CategoriesTabProvider = ({ children, initialCategories }: CategoriesTabProviderProps) => {
  const adminCategoriesTab = useAdminCategoriesTab({ categories: initialCategories });

  return (
    <CategoriesTabContext.Provider value={adminCategoriesTab}>
      {children}
      {adminCategoriesTab.confirmation && (
        <ConfirmationDialog
          isOpen={adminCategoriesTab.confirmation.isOpen}
          onClose={adminCategoriesTab.confirmation.hideConfirmation}
          onConfirm={adminCategoriesTab.confirmation.onConfirm || (() => {})}
          title={adminCategoriesTab.confirmation.title}
          message={adminCategoriesTab.confirmation.message}
          confirmText={adminCategoriesTab.confirmation.confirmText}
          cancelText={adminCategoriesTab.confirmation.cancelText}
          variant={adminCategoriesTab.confirmation.variant}
          isLoading={adminCategoriesTab.confirmation.isLoading}
        />
      )}
    </CategoriesTabContext.Provider>
  );
};

export const useCategoriesTab = () => {
  const context = useContext(CategoriesTabContext);
  if (!context) throw new Error('useCategoriesTab must be used within a CategoriesTabProvider');
  return context;
};
