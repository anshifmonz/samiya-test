import React, { useState } from 'react';
import { type Product } from '@/types/product';
import { type Category } from '@/types/category';
import { Plus } from 'lucide-react';
import AdminProductForm from './AdminProductForm';
import AdminProductGrid from './AdminProductGrid';
import AdminSearchBar from '../AdminSearchBar';

interface AdminProductsTabProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    onAddProduct(newProduct);
    setShowAddForm(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    onEditProduct(updatedProduct);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
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

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <AdminProductGrid
        products={filteredProducts}
        onEdit={setEditingProduct}
        onDelete={onDeleteProduct}
      />

      {(showAddForm || editingProduct) && (
        <AdminProductForm
          product={editingProduct}
          categories={categories}
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

export default AdminProductsTab;
