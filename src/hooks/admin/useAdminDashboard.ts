import { useState } from 'react';
import { type Product } from 'types/product';
import { type Collection } from 'types/collection';
import { type Category } from 'types/category';
import { type Section, type SectionWithProducts } from 'types/section';
import { showToast } from '@/hooks/ui/use-toast';
import { apiRequest } from 'utils/apiRequest';
import { useConfirmation } from '@/hooks/useConfirmation';

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
  const confirmation = useConfirmation();

  // Product handlers with API calls
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
const { data, error } = await apiRequest('/api/admin/product', { method: 'POST', body: newProduct, showLoadingBar: true });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product added successfully' });
    return data;
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    console.log('updatedProduct', updatedProduct);
const { data, error } = await apiRequest('/api/admin/product', { method: 'PUT', body: updatedProduct, showLoadingBar: true });
    if (error) {
      showToast({ type: 'error', title: 'Error', description: error });
      return null;
    }
    showToast({ title: 'Success', description: 'Product updated successfully' });
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
    return true;
  };

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

  // Section handlers with API calls
  const fetchSections = async () => {
const { data } = await apiRequest('/api/admin/section?withProducts=true', { showLoadingBar: true });
    if (data) {
      setSectionList(data.sections);
    }
  };

  const handleAddSection = async (newSection: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => {
const { error } = await apiRequest('/api/admin/section', { method: 'POST', body: newSection, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditSection = async (updatedSection: Section) => {
const { error } = await apiRequest('/api/admin/section', { method: 'PUT', body: updatedSection, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteSection = async (sectionId: string, sectionTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Section',
      message: `Are you sure you want to permanently delete the section${sectionTitle ? ` "${sectionTitle}"` : ''}? This will remove all products from this section. This action cannot be undone.`,
      confirmText: 'Delete Section',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    
    if (!confirmed) return;
    
const { error } = await apiRequest(`/api/admin/section?id=${encodeURIComponent(sectionId)}`, { method: 'DELETE', showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleAddProductToSection = async (sectionId: string, productId: string) => {
const { error } = await apiRequest('/api/admin/section/products', { method: 'POST', body: { sectionId, productId }, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Product added to section successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleRemoveProductFromSection = async (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Remove Product from Section',
      message: `Are you sure you want to remove${productTitle ? ` "${productTitle}"` : ' this product'} from${sectionTitle ? ` the "${sectionTitle}" section` : ' this section'}? The product will remain in your inventory but will no longer appear in this section.`,
      confirmText: 'Remove Product',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    
    if (!confirmed) return;
    
const { error } = await apiRequest(`/api/admin/section/products?sectionId=${encodeURIComponent(sectionId)}&productId=${encodeURIComponent(productId)}`, { method: 'DELETE', showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Product removed from section successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleReorderSectionProducts = async (sectionId: string, productIds: string[]) => {
const { error } = await apiRequest('/api/admin/section/products', { method: 'PATCH', body: { sectionId, productIds }, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section products reordered successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleReorderSections = async (sectionIds: string[]) => {
const { error } = await apiRequest('/api/admin/section', { method: 'PATCH', body: { sectionIds }, showLoadingBar: true });
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
    confirmation,
  };
};
