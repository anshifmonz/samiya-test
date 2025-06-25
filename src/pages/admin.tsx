
import React, { useState } from 'react';
import { products, Product } from '../data/products';
import Navigation from '../components/shared/Navigation';
import AdminSearchBar from '../components/admin/AdminSearchBar';
import AdminProductGrid from '../components/admin/AdminProductGrid';
import AdminProductForm from '../components/admin/AdminProductForm';
import { Plus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>(products);

  const filteredProducts = productList.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = (Math.max(...productList.map(p => parseInt(p.id))) + 1).toString();
    const product: Product = { ...newProduct, id };
    setProductList([...productList, product]);
    setShowAddForm(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProductList(productList.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductList(productList.filter(p => p.id !== productId));
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
              Manage your product catalog with ease
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <AdminSearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="luxury-btn-primary px-6 py-3 rounded-xl font-medium text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <AdminProductGrid
          products={filteredProducts}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {(showAddForm || editingProduct) && (
        <AdminProductForm
          product={editingProduct}
          onSave={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
