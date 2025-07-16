import { useState } from 'react';
import { type Product } from 'types/product';
import { type Collection } from 'types/collection';
import { type Category } from 'types/category';
import { type Section, type SectionWithProducts } from 'types/section';
import { showToast } from 'hooks/use-toast';

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
    try {
      const response = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to add product';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
        return null;
      }
      const { product } = await response.json();
      showToast({ title: 'Success', description: 'Product added successfully' });
      return product;
    } catch (error) {
      console.error('Error adding product:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to add product. Please try again.' });
      return null;
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch('/api/admin/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to update product';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
        return null;
      }
      const { product } = await response.json();
      showToast({ title: 'Success', description: 'Product updated successfully' });
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to update product. Please try again.' });
      return null;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/product?id=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to delete product';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
        return false;
      }
      showToast({ title: 'Success', description: 'Product deleted successfully' });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to delete product. Please try again.' });
      return false;
    }
  };

  // Collection handlers with API calls
  const fetchCollections = async () => {
    const response = await fetch('/api/admin/collection');
    if (response.ok) {
      const { collections } = await response.json();
      setCollectionList(collections);
    }
  };

  const handleAddCollection = async (newCollection: Omit<Collection, 'id'>) => {
    try {
      const response = await fetch('/api/admin/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection),
      });
      if (response.ok) {
        await fetchCollections();
        showToast({ title: 'Success', description: 'Collection added successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to add collection';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error adding collection:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to add collection. Please try again.' });
    }
  };

  const handleEditCollection = async (updatedCollection: Collection) => {
    try {
      const response = await fetch('/api/admin/collection', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCollection),
      });
      if (response.ok) {
        await fetchCollections();
        showToast({ title: 'Success', description: 'Collection updated successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to update collection';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to update collection. Please try again.' });
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/admin/collection?id=${encodeURIComponent(collectionId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchCollections();
        showToast({ title: 'Success', description: 'Collection deleted successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to delete collection';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to delete collection. Please try again.' });
    }
  };

  // Category handlers with API calls
  const fetchCategories = async () => {
    const response = await fetch('/api/admin/category');
    if (response.ok) {
      const { categories } = await response.json();
      setCategoryList(categories);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>) => {
    try {
      const response = await fetch('/api/admin/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        await fetchCategories();
        showToast({ title: 'Success', description: 'Category added successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to add category';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to add category. Please try again.' });
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    try {
      const response = await fetch('/api/admin/category', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      });
      if (response.ok) {
        await fetchCategories();
        showToast({ title: 'Success', description: 'Category updated successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to update category';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to update category. Please try again.' });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/category?id=${encodeURIComponent(categoryId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchCategories();
        showToast({ title: 'Success', description: 'Category deleted successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to delete category';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to delete category. Please try again.' });
    }
  };

  // Section handlers with API calls
  const fetchSections = async () => {
    const response = await fetch('/api/admin/section?withProducts=true');
    if (response.ok) {
      const { sections } = await response.json();
      setSectionList(sections);
    }
  };

  const handleAddSection = async (newSection: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/admin/section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Section added successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to add section';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error adding section:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to add section. Please try again.' });
    }
  };

  const handleEditSection = async (updatedSection: Section) => {
    try {
      const response = await fetch('/api/admin/section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection),
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Section updated successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to update section';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error updating section:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to update section. Please try again.' });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/section?id=${encodeURIComponent(sectionId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Section deleted successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to delete section';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to delete section. Please try again.' });
    }
  };

  const handleAddProductToSection = async (sectionId: string, productId: string) => {
    try {
      const response = await fetch('/api/admin/section/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, productId }),
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Product added to section successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to add product to section';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error adding product to section:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to add product to section. Please try again.' });
    }
  };

  const handleRemoveProductFromSection = async (sectionId: string, productId: string) => {
    try {
      const response = await fetch(`/api/admin/section/products?sectionId=${encodeURIComponent(sectionId)}&productId=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Product removed from section successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to remove product from section';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error removing product from section:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to remove product from section. Please try again.' });
    }
  };

  const handleReorderSectionProducts = async (sectionId: string, productIds: string[]) => {
    try {
      const response = await fetch('/api/admin/section/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, productIds }),
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Section products reordered successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to reorder section products';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error reordering section products:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to reorder section products. Please try again.' });
    }
  };

  const handleReorderSections = async (sectionIds: string[]) => {
    try {
      const response = await fetch('/api/admin/section', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionIds }),
      });
      if (response.ok) {
        await fetchSections();
        showToast({ title: 'Success', description: 'Sections reordered successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to reorder sections';
        showToast({ type: 'error', title: 'Error', description: errorMessage });
      }
    } catch (error) {
      console.error('Error reordering sections:', error);
      showToast({ type: 'error', title: 'Error', description: 'Failed to reorder sections. Please try again.' });
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
