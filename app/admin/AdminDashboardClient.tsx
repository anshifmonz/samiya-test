"use client";

import React, { useState } from 'react';
import { Product } from '@/data/products';
import { type Collection } from '@/data/collections';
import { Category } from '@/data/categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import AdminProductsTab from 'components/admin/product/AdminProductsTab';
import AdminCollectionsTab from 'components/admin/collection/AdminCollectionsTab';
import AdminCategoriesTab from 'components/admin/category/AdminCategoriesTab';

interface Props {
  initialProducts: Product[];
  initialCollections: Collection[];
  initialCategories: Category[];
}

export default function AdminDashboardClient({
  initialProducts,
  initialCollections,
  initialCategories
}: Props) {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [collectionList, setCollectionList] = useState<Collection[]>(initialCollections);
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);

  // Product handlers with API calls
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setProductList(productList.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
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
  const handleAddCollection = async (newCollection: Omit<Collection, 'id'>) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollection),
      });

      if (response.ok) {
        const { collection } = await response.json();
        setCollectionList([...collectionList, collection]);
      } else {
        console.error('Failed to add collection');
      }
    } catch (error) {
      console.error('Error adding collection:', error);
    }
  };

  const handleEditCollection = (updatedCollection: Collection) => {
    setCollectionList(collectionList.map(c => c.id === updatedCollection.id ? updatedCollection : c));
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollectionList(collectionList.filter(c => c.id !== collectionId));
  };

  // Category handlers with API calls
  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const { category } = await response.json();
        setCategoryList([...categoryList, category]);
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = (updatedCategory: Category) => {
    const now = new Date().toISOString();
    const categoryWithUpdatedTime = { ...updatedCategory, updatedAt: now };
    setCategoryList(categoryList.map(c => c.id === updatedCategory.id ? categoryWithUpdatedTime : c));
  };

  const handleDeleteCategory = (categoryId: string) => {
    // also delete all child categories
    const deleteCategoryAndChildren = (id: string): string[] => {
      const toDelete = [id];
      categoryList.forEach(category => {
        if (category.parentId === id) {
          toDelete.push(...deleteCategoryAndChildren(category.id));
        }
      });
      return toDelete;
    };

    const categoriesToDelete = deleteCategoryAndChildren(categoryId);
    setCategoryList(categoryList.filter(c => !categoriesToDelete.includes(c.id)));
  };

  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent border-none p-1">
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
  );
}
