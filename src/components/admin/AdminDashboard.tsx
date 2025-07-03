"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Product } from '@/types/product';
import { type Collection } from '@/types/collection';
import { type Category } from '@/types/category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import AdminProductsTab from './product/AdminProductsTab';
import AdminCollectionsTab from './collection/AdminCollectionsTab';
import AdminCategoriesTab from './category/AdminCategoriesTab';

interface AdminDashboardProps {
  initialProducts: Product[];
  initialCollections: Collection[];
  initialCategories: Category[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialProducts,
  initialCollections,
  initialCategories
}) => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [collectionList, setCollectionList] = useState<Collection[]>(initialCollections);
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/admin/login');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // product handlers with API calls
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const { product } = await response.json();
        setProductList([...productList, product]);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch('/api/admin/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (response.ok) {
        const { product } = await response.json();
        setProductList(productList.map(p => p.id === updatedProduct.id ? product : p));
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/product?id=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProductList(productList.filter(p => p.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
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

  return (
    <div className="w-full">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent border-none p-1 mb-8">
          <TabsTrigger
            value="products"
            className="rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black data-[state=active]:shadow-md"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="collections"
            className="rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black data-[state=active]:shadow-md"
          >
            Collections
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black data-[state=active]:shadow-md"
          >
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          <AdminProductsTab
            products={productList}
            categories={categoryList}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </TabsContent>

        <TabsContent value="collections" className="mt-0">
          <AdminCollectionsTab
            collections={collectionList}
            onAddCollection={handleAddCollection}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <AdminCategoriesTab
            categories={categoryList}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
