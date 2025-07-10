import React, { Suspense } from 'react';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import AdminDashboard from 'components/admin/AdminDashboard';
import getProducts from 'lib/admin/product/get';
import getCollections from 'lib/admin/collection/get';
import getCategories from 'lib/admin/category/get';
import { getSectionsWithProducts } from 'lib/admin/section/get';
import LogoutButton from 'components/admin/LogoutButton';

export const revalidate = 0;

async function getAdminData() {
  const products = await getProducts(16, 0);
  const collections = await getCollections();
  const categories = await getCategories();
  const sections = await getSectionsWithProducts();

  return {
    products,
    collections,
    categories,
    sections
  };
}

export default async function Admin() {
  const { products: productList, collections: collectionList, categories: categoryList, sections: sectionList } = await getAdminData();

  return (
    <div className="min-h-screen bg-luxury-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <div className="flex justify-between items-center animate-fade-in-up">
            <div className="mb-6">
              <h1 className="luxury-heading xs:text-2xl text-3xl sm:text-4xl text-luxury-black mb-2 sm:mb-4">
                Admin Dashboard
              </h1>
              <p className="luxury-body text-luxury-gray xs:text-sm text-base sm:text-lg">
                Manage your products, collections, and categories with ease
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-luxury-gray/20 rounded-xl p-3 sm:p-6">
          <Suspense fallback={<LoadingSpinner text="Loading admin dashboard..." />}>
            <AdminDashboard
              initialProducts={productList}
              initialCollections={collectionList}
              initialCategories={categoryList}
              initialSections={sectionList}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
