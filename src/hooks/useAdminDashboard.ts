import { useState } from 'react';
import { type Product } from 'types/product';
import { type Collection } from 'types/collection';
import { type Category } from 'types/category';
import { type Section, type SectionWithProducts } from 'types/section';
import { showToast } from 'hooks/use-toast';
import { apiRequest } from 'utils/apiRequest';

interface UseAdminDashboardProps {
  initialProducts: Product[];
  initialCollections: Collection[];
  initialCategories: Category[];
  initialSections: SectionWithProducts[];
}

export const useAdminDashboard = ({
  initialProducts,
  initialCollections,
  initialCategories,
  initialSections
}: UseAdminDashboardProps) => {
  const [collectionList, setCollectionList] = useState<Collection[]>(initialCollections);
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
  const [sectionList, setSectionList] = useState<SectionWithProducts[]>(initialSections);

  // Product handlers with API calls
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const { data, error } = await apiRequest('/api/admin/product', { method: 'POST', body: newProduct });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product added successfully' });
    return data;
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    console.log('updatedProduct', updatedProduct);
    const { data, error } = await apiRequest('/api/admin/product', { method: 'PUT', body: updatedProduct });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product updated successfully' });
    return data;
  };

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await apiRequest(`/api/admin/product?id=${encodeURIComponent(productId)}`, { method: 'DELETE' });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return false;
    }
    showToast({ title: 'Success', description: 'Product deleted successfully' });
    return true;
  };

  // Collection handlers with API calls
  const fetchCollections = async () => {
    const { data } = await apiRequest('/api/admin/collection');
    if (data) {
      setCollectionList(data.collections);
    }
  };

  const handleAddCollection = async (newCollection: Omit<Collection, 'id'>) => {
    const { error } = await apiRequest('/api/admin/collection', { method: 'POST', body: newCollection });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditCollection = async (updatedCollection: Collection) => {
    const { error } = await apiRequest('/api/admin/collection', { method: 'PUT', body: updatedCollection });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    const { error } = await apiRequest(`/api/admin/collection?id=${encodeURIComponent(collectionId)}`, { method: 'DELETE' });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  // Category handlers with API calls
  const fetchCategories = async () => {
    const { data } = await apiRequest('/api/admin/category');
    if (data) {
      setCategoryList(data.categories);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>) => {
    const { error } = await apiRequest('/api/admin/category', { method: 'POST', body: newCategory });
    if (!error) {
      await fetchCategories();
      showToast({ title: 'Success', description: 'Category added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    const { error } = await apiRequest('/api/admin/category', { method: 'PUT', body: updatedCategory });
    if (!error) {
      await fetchCategories();
      showToast({ title: 'Success', description: 'Category updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const { error } = await apiRequest(`/api/admin/category?id=${encodeURIComponent(categoryId)}`, { method: 'DELETE' });
    if (!error) {
      await fetchCategories();
      showToast({ title: 'Success', description: 'Category deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  // Section handlers with API calls
  const fetchSections = async () => {
    const { data } = await apiRequest('/api/admin/section?withProducts=true');
    if (data) {
      setSectionList(data.sections);
    }
  };

  const handleAddSection = async (newSection: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { error } = await apiRequest('/api/admin/section', { method: 'POST', body: newSection });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditSection = async (updatedSection: Section) => {
    const { error } = await apiRequest('/api/admin/section', { method: 'PUT', body: updatedSection });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const { error } = await apiRequest(`/api/admin/section?id=${encodeURIComponent(sectionId)}`, { method: 'DELETE' });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleAddProductToSection = async (sectionId: string, productId: string) => {
    const { error } = await apiRequest('/api/admin/section/products', { method: 'POST', body: { sectionId, productId } });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Product added to section successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleRemoveProductFromSection = async (sectionId: string, productId: string) => {
    const { error } = await apiRequest(`/api/admin/section/products?sectionId=${encodeURIComponent(sectionId)}&productId=${encodeURIComponent(productId)}`, { method: 'DELETE' });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Product removed from section successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleReorderSectionProducts = async (sectionId: string, productIds: string[]) => {
    const { error } = await apiRequest('/api/admin/section/products', { method: 'PATCH', body: { sectionId, productIds } });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section products reordered successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleReorderSections = async (sectionIds: string[]) => {
    const { error } = await apiRequest('/api/admin/section', { method: 'PATCH', body: { sectionIds } });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Sections reordered successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  return {
    collectionList,
    categoryList,
    sectionList,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddCollection,
    handleEditCollection,
    handleDeleteCollection,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddSection,
    handleEditSection,
    handleDeleteSection,
    handleAddProductToSection,
    handleRemoveProductFromSection,
    handleReorderSectionProducts,
    handleReorderSections,
  };
};
