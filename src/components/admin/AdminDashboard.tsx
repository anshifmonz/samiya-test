"use client";

import { type Product } from '@/types/product';
import { type Collection } from '@/types/collection';
import { type Category } from '@/types/category';
import { type SectionWithProducts } from '@/types/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import AdminProductsTab from './product/AdminProductsTab';
import AdminCollectionsTab from './collection/AdminCollectionsTab';
import AdminCategoriesTab from './category/AdminCategoriesTab';
import { AdminSectionsTab } from './section';
import { useAdminDashboard } from 'hooks/useAdminDashboard';
import React, { useState } from 'react';

interface AdminDashboardProps {
  initialProducts: Product[];
  initialCollections: Collection[];
  initialCategories: Category[];
  initialSections: SectionWithProducts[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialProducts,
  initialCollections,
  initialCategories,
  initialSections
}) => {
  const {
    productList,
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
    handleRemoveProductFromSection
  } = useAdminDashboard({
    initialProducts,
    initialCollections,
    initialCategories,
    initialSections
  });

  const [activeTab, setActiveTab] = useState('products');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabOptions = [
    { value: 'products', label: 'Products' },
    { value: 'collections', label: 'Collections' },
    { value: 'categories', label: 'Categories' },
    { value: 'sections', label: 'Sections' }
  ];

  return (
    <div className="w-full">
      <div className="sm:hidden mb-4">
        <label htmlFor="admin-dashboard-tab-select" className="sr-only">
          Select section
        </label>
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger
            id="admin-dashboard-tab-select"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-900 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold hover:border-luxury-gold transition-colors duration-200"
          >
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {tabOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm font-medium text-gray-900 hover:bg-luxury-gold hover:text-luxury-black focus:bg-luxury-gold focus:text-luxury-black cursor-pointer transition-colors duration-200"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          className="hidden sm:grid w-full grid-cols-4 bg-transparent border-none p-1 mb-8"
          aria-label="Admin dashboard sections"
        >
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
          <TabsTrigger
            value="sections"
            className="rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black data-[state=active]:shadow-md"
          >
            Sections
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

        <TabsContent value="sections" className="mt-0">
          <AdminSectionsTab
            sections={sectionList}
            products={productList}
            onAddSection={handleAddSection}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
            onAddProductToSection={handleAddProductToSection}
            onRemoveProductFromSection={handleRemoveProductFromSection}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
