import { Plus, Search } from 'lucide-react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import AdminTabHeader from '../shared/AdminTabHeader';
import AdminProductForm from './AdminProductForm';
import AdminProductGrid from './AdminProductGrid';
import { useAdminProductsTab } from 'hooks/useAdminProductsTab';

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
  const {
    searchQuery,
    products,
    loading,
    hasMore,
    error,
    isSearching,
    loaderRef,
    handleSearchChange,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleShowAddForm,
    handleStartEditing,
    handleCancelForm,
    isFormVisible,
    currentProduct,
    productsCountText
  } = useAdminProductsTab({
    initialProducts,
    categories,
    onAddProduct,
    onEditProduct,
    onDeleteProduct
  });

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleShowAddForm}
        addLabel="Add Product"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
            {productsCountText}
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
        onEdit={handleStartEditing}
        onDelete={handleDeleteProduct}
        loading={loading}
        hasMore={hasMore}
        loaderRef={loaderRef}
        error={error}
        isSearching={isSearching}
      />

      {isFormVisible && (
        <AdminProductForm
          product={currentProduct}
          categories={categories}
          onSave={currentProduct ? handleEditProduct : handleAddProduct}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default AdminProductsTab;
