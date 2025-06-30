import React, { Suspense } from 'react';
import { products } from '@/data/products';
import collections from '@/data/collections';
import { categories } from '@/data/categories';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import AdminDashboardClient from './AdminDashboardClient';

// Server functions to fetch data
async function getAdminData() {
  // Simulate API calls (in real implementation, these would be actual API calls)
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    products: [...products],
    collections: [...collections],
    categories: [...categories]
  };
}

export default async function AdminDashboard() {
  const { products: productList, collections: collectionList, categories: categoryList } = await getAdminData();

  return (
    <div className="min-h-screen bg-luxury-cream">
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
          <Suspense fallback={<LoadingSpinner text="Loading admin dashboard..." />}>
            <AdminDashboardClient
              initialProducts={productList}
              initialCollections={collectionList}
              initialCategories={categoryList}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
