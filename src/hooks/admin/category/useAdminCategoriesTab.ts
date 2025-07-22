import { useState, useMemo } from 'react';
import { type Category } from 'types/category';

interface UseAdminCategoriesTabProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string, categoryName?: string) => void;
}

export const useAdminCategoriesTab = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: UseAdminCategoriesTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      category.path.some(pathSegment => pathSegment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      category.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleAddCategory = (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddCategory(newCategory);
    setShowAddForm(false);
  };

  const handleEditCategory = (updatedCategoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCategory) {
      const updatedCategory: Category = {
        ...updatedCategoryData,
        id: editingCategory.id,
        createdAt: editingCategory.createdAt,
        updatedAt: new Date().toISOString()
      };
      onEditCategory(updatedCategory);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    onDeleteCategory(categoryId, categoryName);
  };

  const handleShowAddForm = () => setShowAddForm(true);
  const handleHideAddForm = () => setShowAddForm(false);
  const handleStartEditing = (category: Category) => setEditingCategory(category);
  const handleStopEditing = () => setEditingCategory(null);

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const isFormVisible = showAddForm || !!editingCategory;
  const currentCategory = editingCategory;
  const categoriesCount = filteredCategories.length;
  const categoriesCountText = `${categoriesCount} categor${categoriesCount !== 1 ? 'ies' : 'y'} found`;

  return {
    // State
    searchQuery,
    showAddForm,
    editingCategory,
    filteredCategories,

    // Handlers
    handleSearchChange,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleShowAddForm,
    handleHideAddForm,
    handleStartEditing,
    handleStopEditing,
    handleCancelForm,

    // Computed values
    isFormVisible,
    currentCategory,
    categoriesCountText
  };
};
