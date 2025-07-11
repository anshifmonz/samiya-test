import { useState } from 'react';
import { type Product } from 'types/product';
import { type Collection } from 'types/collection';
import { type Category } from 'types/category';
import { type Section, type SectionWithProducts } from 'types/section';

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
        console.error('Failed to add product');
        throw new Error('Failed to add product');
      }
      const { product } = await response.json();
      return product;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
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
        console.error('Failed to update product');
        throw new Error('Failed to update product');
      }
      const { product } = await response.json();
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/product?id=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Failed to delete product');
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
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
      } else {
        console.error('Failed to add collection');
      }
    } catch (error) {
      console.error('Error adding collection:', error);
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
      } else {
        console.error('Failed to update collection');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/admin/collection?id=${encodeURIComponent(collectionId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchCollections();
      } else {
        console.error('Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
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
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
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
      } else {
        console.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/category?id=${encodeURIComponent(categoryId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchCategories();
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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
      } else {
        console.error('Failed to add section');
      }
    } catch (error) {
      console.error('Error adding section:', error);
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
      } else {
        console.error('Failed to update section:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/section?id=${encodeURIComponent(sectionId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchSections();
      } else {
        console.error('Failed to delete section');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
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
      } else {
        console.error('Failed to add product to section:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product to section:', error);
    }
  };

  const handleRemoveProductFromSection = async (sectionId: string, productId: string) => {
    try {
      const response = await fetch(`/api/admin/section/products?sectionId=${encodeURIComponent(sectionId)}&productId=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchSections();
      } else {
        console.error('Failed to remove product from section:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing product from section:', error);
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
      } else {
        console.error('Failed to reorder sections:', response.statusText);
      }
    } catch (error) {
      console.error('Error reordering sections:', error);
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
    handleReorderSections,
  };
};
