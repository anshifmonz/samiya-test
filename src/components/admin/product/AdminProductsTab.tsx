import { useState } from 'react';
import { Plus, Search, Upload } from 'lucide-react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import AdminTabHeader from '../shared/AdminTabHeader';
import AdminProductForm from './AdminProductForm';
import AdminProductGrid from './AdminProductGrid';
import BulkImportModal from './BulkImportModal';
import { useAdminProductsTab } from 'hooks/admin/product/useAdminProductsTab';
import { useSizes } from 'hooks/admin/product/useSizes';
import { usePersistentBulkImportData } from './bulk/hooks';
import { apiRequest } from 'utils/apiRequest';
import { showToast } from 'hooks/ui/use-toast';

interface AdminProductsTabProps {
  initialProducts: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  isSuperAdmin: boolean;
}

const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  initialProducts,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  isSuperAdmin
}) => {
  const { sizes, loading: sizesLoading } = useSizes();
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  const { persistentData, saveData, clearData, isLoaded } = usePersistentBulkImportData();

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
    productsCountText,
    refreshProducts
  } = useAdminProductsTab({
    initialProducts,
    categories,
    onAddProduct,
    onEditProduct,
    onDeleteProduct
  });

  const handleBulkImport = async (products: Omit<Product, 'id'>[]) => {
    setIsBulkImporting(true);
    try {
      const { data, error } = await apiRequest('/api/admin/product/bulk', {
        method: 'POST',
        body: { products }
      });

      if (error) {
        throw new Error(error);
      }

      const summary = data.summary;
      if (summary.failed > 0) {
        showToast({
          type: 'error',
          title: 'Bulk Import Completed',
          description: `Successfully imported ${summary.successful} products, ${summary.failed} failed. Check console for details.`
        });
      } else {
        showToast({
          title: 'Bulk Import Successful',
          description: `Successfully imported ${summary.successful} products.`
        });
      }

      refreshProducts();
      clearData();
      setShowBulkImport(false);
    } catch (err) {
      console.error('Bulk import error:', err);
      showToast({
        type: 'error',
        title: 'Bulk Import Failed',
        description: err instanceof Error ? err.message : 'An error occurred during bulk import.'
      });
    } finally {
      setIsBulkImporting(false);
    }
  };

  const handleCancelBulkImport = () => {
    setShowBulkImport(false);
  };

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleShowAddForm}
        addLabel="Add Product"
        additionalActions={
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-luxury-gold hover:text-luxury-gold/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={sizesLoading || isBulkImporting}
          >
            <Upload size={20} className={isBulkImporting ? 'animate-spin' : ''} />
            <span className="hidden sm:block">{isBulkImporting ? 'Importing...' : 'Bulk Import'}</span>
          </button>
        }
        forceSmLabel={true}
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
        isSuperAdmin={isSuperAdmin}
      />

      {isFormVisible && (
        <AdminProductForm
          product={currentProduct}
          categories={categories}
          onSave={currentProduct ? handleEditProduct : handleAddProduct}
          onCancel={handleCancelForm}
        />
      )}

      {showBulkImport && isLoaded && (
        <BulkImportModal
          categories={categories}
          sizes={sizes}
          onImport={handleBulkImport}
          onCancel={handleCancelBulkImport}
          persistentData={persistentData}
          onDataChange={saveData}
          onClearData={clearData}
        />
      )}
    </div>
  );
};

export default AdminProductsTab;
