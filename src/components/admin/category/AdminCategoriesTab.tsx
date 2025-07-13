import React from 'react';
import AdminCategoryGrid from './AdminCategoryGrid';
import AdminCategoryForm from './AdminCategoryForm';
import AdminTabHeader from '../shared/AdminTabHeader';
import { Plus } from 'lucide-react';
import { type Category } from 'types/category';
import { useAdminCategoriesTab } from 'hooks/useAdminCategoriesTab';

interface AdminCategoriesTabProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const {
    searchQuery,
    filteredCategories,
    handleSearchChange,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleShowAddForm,
    handleStartEditing,
    handleCancelForm,
    isFormVisible,
    currentCategory,
    categoriesCountText
  } = useAdminCategoriesTab({
    categories,
    onAddCategory,
    onEditCategory,
    onDeleteCategory
  });

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleShowAddForm}
        addLabel="Add Category"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {categoriesCountText}
        </p>
      </div>

      <AdminCategoryGrid
        categories={filteredCategories}
        onEdit={handleStartEditing}
        onDelete={handleDeleteCategory}
      />

      {isFormVisible && (
        <AdminCategoryForm
          category={currentCategory}
          categories={categories}
          onSave={currentCategory ? handleEditCategory : handleAddCategory}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default AdminCategoriesTab;
