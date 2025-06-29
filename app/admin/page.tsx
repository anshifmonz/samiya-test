"use client";

import React, { useState } from 'react';
import { products, Product } from '@/data/products';
import collections from '@/data/collections';
import { categories, Category } from '@/data/categories';
import Navigation from '@/components/shared/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProductsTab from '@/components/admin/product/AdminProductsTab';
import AdminCollectionsTab from '@/components/admin/collection/AdminCollectionsTab';
import AdminCategoriesTab from '@/components/admin/category/AdminCategoriesTab';

export default function AdminDashboard() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [collectionList, setCollectionList] = useState(collections);
  const [categoryList, setCategoryList] = useState<Category[]>(categories);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = (Math.max(...productList.map(p => parseInt(p.id))) + 1).toString();
    const product: Product = { ...newProduct, id };
    setProductList([...productList, product]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProductList(productList.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProductList(productList.filter(p => p.id !== productId));
  };

  const handleAddCollection = (newCollection: Omit<typeof collections[0], 'id'>) => {
    const id = `collection-${Date.now()}`;
    const collection = { ...newCollection, id };
    setCollectionList([...collectionList, collection]);
  };

  const handleEditCollection = (updatedCollection: typeof collections[0]) => {
    setCollectionList(collectionList.map(c => c.id === updatedCollection.id ? updatedCollection : c));
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollectionList(collectionList.filter(c => c.id !== collectionId));
  };

  const handleAddCategory = (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `category-${Date.now()}`;
    const now = new Date().toISOString();
    const category: Category = {
      ...newCategory,
      id,
      createdAt: now,
      updatedAt: now
    };
    setCategoryList([...categoryList, category]);
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
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <div className="animate-fade-in-up">
            <h1 className="luxury-heading text-4xl text-luxury-black mb-4">
              Admin Dashboard
            </h1>
            <p className="luxury-body text-luxury-gray text-lg mb-8">
              Manage your products, collections, and categories with ease
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-luxury-gray/20 rounded-xl p-6">
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
        </div>
      </div>
    </div>
  );
}
