"use client";

import React, { useState } from 'react';
import { type Product } from '@/data/products';
import { type Collection } from '@/data/collections';
import { type Category } from '@/data/categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import AdminProductsTab from 'components/admin/product/AdminProductsTab';
import AdminCollectionsTab from 'components/admin/collection/AdminCollectionsTab';
import AdminCategoriesTab from 'components/admin/category/AdminCategoriesTab';

import createProduct from '@/lib/admin/product/create';
import updateProduct from '@/lib/admin/product/update';
import deleteProduct from '@/lib/admin/product/delete';
import createCollection from '@/lib/admin/collection/create';
import updateCollection from '@/lib/admin/collection/update';
import deleteCollection from '@/lib/admin/collection/delete';
import getCategories from '@/lib/admin/category/get';
import createCategory from '@/lib/admin/category/create';
import updateCategory from '@/lib/admin/category/update';
import deleteCategory from '@/lib/admin/category/delete';

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

  // product handlers with API calls
  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const created = await createProduct(newProduct);
      if (created) {
        setProductList([...productList, created]);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const updated = await updateProduct(updatedProduct);
      if (updated) {
        setProductList(productList.map(p => p.id === updatedProduct.id ? updated : p));
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const deleted = await deleteProduct(productId);
      if (deleted) {
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
      const created = await createCollection(newCollection);
      if (created) {
        setCollectionList([...collectionList, created]);
      } else {
        console.error('Failed to add collection');
      }
    } catch (error) {
      console.error('Error adding collection:', error);
    }
  };

  const handleEditCollection = async (updatedCollection: Collection) => {
    try {
      const updated = await updateCollection(updatedCollection);
      if (updated) {
        setCollectionList(collectionList.map(c => c.id === updatedCollection.id ? updated : c));
      } else {
        console.error('Failed to update collection');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const deleted = await deleteCollection(collectionId);
      if (deleted) {
        setCollectionList(collectionList.filter(c => c.id !== collectionId));
      } else {
        console.error('Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  // Category handlers with API calls
  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children'>) => {
    try {
      const created = await createCategory(newCategory as any);
      if (created) {
        // Refetch all categories to get updated tree
        setCategoryList(await getCategories());
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    try {
      const updated = await updateCategory(updatedCategory);
      if (updated) {
        setCategoryList(await getCategories());
      } else {
        console.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const deleted = await deleteCategory(categoryId);
      if (deleted) {
        setCategoryList(await getCategories());
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
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
