"use client";

import { type Product } from '@/types/product';
import { type Collection } from '@/types/collection';
import { type Category } from '@/types/category';
import { type SectionWithProducts } from '@/types/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import AdminProductsTab from './product/AdminProductsTab';
import AdminCollectionsTab from './collection/AdminCollectionsTab';
import AdminCategoriesTab from './category/AdminCategoriesTab';
import { AdminSectionsTab } from './section';
import { useAdminDashboard } from 'hooks/useAdminDashboard';

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

  return (
    <div className="w-full">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-transparent border-none p-1 mb-8">
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
