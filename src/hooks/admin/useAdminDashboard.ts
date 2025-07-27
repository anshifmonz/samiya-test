import { useState } from 'react';
import { type Collection } from 'types/collection';
import { type Category } from 'types/category';
import { showToast } from 'hooks/ui/use-toast';
import { apiRequest } from 'utils/apiRequest';
import { useConfirmation } from 'hooks/useConfirmation';

interface UseAdminDashboardProps {
  initialCollections: Collection[];
  initialCategories: Category[];
}

export const useAdminDashboard = ({
  initialCollections,
  initialCategories
}: UseAdminDashboardProps) => {
  const [collectionList, setCollectionList] = useState<Collection[]>(initialCollections);
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
  const confirmation = useConfirmation();

  // Collection handlers with API calls
  const fetchCollections = async () => {
const { data } = await apiRequest('/api/admin/collection', { showLoadingBar: true });
    if (data) {
      setCollectionList(data.collections);
    }
  };

  const handleAddCollection = async (newCollection: Omit<Collection, 'id'>) => {
const { error } = await apiRequest('/api/admin/collection', { method: 'POST', body: newCollection, showLoadingBar: true });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditCollection = async (updatedCollection: Collection) => {
const { error } = await apiRequest('/api/admin/collection', { method: 'PUT', body: updatedCollection, showLoadingBar: true });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteCollection = async (collectionId: string, collectionTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Collection',
      message: `Are you sure you want to permanently delete the collection${collectionTitle ? ` "${collectionTitle}"` : ''}? This action cannot be undone.`,
      confirmText: 'Delete Collection',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

const { error } = await apiRequest(`/api/admin/collection?id=${encodeURIComponent(collectionId)}`, { method: 'DELETE', showLoadingBar: true });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  // Category handlers with API calls
  const fetchCategories = async () => {
const { data } = await apiRequest('/api/admin/category', { showLoadingBar: true });
    if (data) {
      setCategoryList(data.categories);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>) => {
const { error } = await apiRequest('/api/admin/category', { method: 'POST', body: newCategory, showLoadingBar: true });
    if (!error) {
      await fetchCategories();
      showToast({ title: 'Success', description: 'Category added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
const { error } = await apiRequest('/api/admin/category', { method: 'PUT', body: updatedCategory, showLoadingBar: true });
    if (!error) {
      await fetchCategories();
      showToast({ title: 'Success', description: 'Category updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Category',
      message: `Are you sure you want to permanently delete the category${categoryName ? ` "${categoryName}"` : ''}? This will also delete all subcategories and may affect products assigned to this category. This action cannot be undone.`,
      confirmText: 'Delete Category',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

const { error } = await apiRequest(`/api/admin/category?id=${encodeURIComponent(categoryId)}`, { method: 'DELETE', showLoadingBar: true });
    if (!error) {
      await fetchCategories();
      showToast({ title: 'Success', description: 'Category deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  return {
    collectionList,
    categoryList,
    handleAddCollection,
    handleEditCollection,
    handleDeleteCollection,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    confirmation,
  };
};
