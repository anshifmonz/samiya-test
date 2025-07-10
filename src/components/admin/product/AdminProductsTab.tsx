import { useState } from 'react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import AdminTabHeader from '../shared/AdminTabHeader';
import { Plus, Search } from 'lucide-react';
import AdminProductForm from './AdminProductForm';
import AdminProductGrid from './AdminProductGrid';
import { useAdminProductInfiniteScroll } from 'hooks/useAdminProductInfiniteScroll';

interface AdminProductsTabProps {
  initialProducts: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  initialProducts,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    products,
    loading,
    hasMore,
    error,
    loaderRef,
    refreshProducts,
    isSearching
  } = useAdminProductInfiniteScroll(initialProducts, searchQuery);

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    onAddProduct(newProduct);
    setShowAddForm(false);
    refreshProducts();
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    onEditProduct(updatedProduct);
    setEditingProduct(null);
    refreshProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    onDeleteProduct(productId);
    refreshProducts();
  };

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setShowAddForm(true)}
        addLabel="Add Product"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
            {products.length} product{products.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {isSearching && (
            <div className="flex items-center space-x-2 text-luxury-gray">
              <Search size={16} className="animate-pulse" />
              <span className="text-sm">Searching...</span>
            </div>
          )}
        </div>
      </div>

      <AdminProductGrid
        products={products}
        onEdit={setEditingProduct}
        onDelete={handleDeleteProduct}
        loading={loading}
        hasMore={hasMore}
        loaderRef={loaderRef}
        error={error}
        isSearching={isSearching}
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
