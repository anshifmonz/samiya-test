import { useState, useMemo } from 'react';
import { apiRequest } from 'utils/apiRequest';
import { type Category } from 'types/category';
import { showToast } from 'hooks/ui/use-toast';
import { useConfirmation } from 'hooks/useConfirmation';

interface UseAdminCategoriesTabProps {
  categories: Category[];
}

export const useAdminCategoriesTab = ({categories}: UseAdminCategoriesTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const confirmation = useConfirmation();

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    return categoryList.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      category.path.some(pathSegment => pathSegment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      category.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoryList, searchQuery]);

  const fetchCategories = async () => {
    const { data } = await apiRequest('/api/admin/category', { showLoadingBar: true });
    if (data) setCategoryList(data.categories);
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { error } = await apiRequest('/api/admin/category', { method: 'POST', body: newCategory, showLoadingBar: true });
    if (error)
      return showToast({ type: 'error', title: 'Error', description: error });
    await fetchCategories();
    showToast({ title: 'Success', description: 'Category added successfully' });
    setShowAddForm(false);
  };

  const handleEditCategory = async (updatedCategoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingCategory) return

    const updatedCategory: Category = {
      ...updatedCategoryData,
      id: editingCategory.id,
      createdAt: editingCategory.createdAt,
      updatedAt: new Date().toISOString()
    };

    const { error } = await apiRequest('/api/admin/category', { method: 'PUT', body: updatedCategory, showLoadingBar: true });
    if (error)
      return showToast({ type: 'error', title: 'Error', description: error });
    await fetchCategories();
    showToast({ title: 'Success', description: 'Category updated successfully' });
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Category',
      message: `Are you sure you want to permanently delete the category${categoryName ? ` "${categoryName}"` : ''}? This will also delete all subcategories and may affect products assigned to this category. This action cannot be undone.`,
      confirmText: 'Delete Category',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    const { error } = await apiRequest(`/api/admin/category?id=${encodeURIComponent(categoryId)}`, { method: 'DELETE', showLoadingBar: true });
    if (error)
      return showToast({ type: 'error', title: 'Error', description: error });
    await fetchCategories();
    showToast({ title: 'Success', description: 'Category deleted successfully' });
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
    categoryList,
    confirmation,

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
    fetchCategories,

    // Computed values
    isFormVisible,
    currentCategory,
    categoriesCountText
  };
};
