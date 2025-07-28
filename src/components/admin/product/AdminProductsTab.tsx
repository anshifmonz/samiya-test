'use client';

import { useState } from 'react';
import { Plus, Search, Upload } from 'lucide-react';
import { type Product } from 'types/product';
import AdminTabHeader from '../shared/AdminTabHeader';
import AdminProductForm from './AdminProductForm';
import AdminProductGrid from './AdminProductGrid';
import BulkImportModal from './BulkImportModal';
import { useSizes } from 'hooks/admin/product/useSizes';
import { usePersistentBulkImportData } from './bulk/hooks';
import { apiRequest } from 'utils/apiRequest';
import { showToast } from 'hooks/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { useProductsTab } from 'contexts/admin/ProductsTabContext';

const AdminProductsTab: React.FC = () => {
  const { sizes, loading: sizesLoading } = useSizes();
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  const { persistentData, saveData, clearData, isLoaded } = usePersistentBulkImportData();

  const {
    searchQuery,
    sortOption,
    handleSortChange,
    handleSearchChange,
    handleShowAddForm,
    isSearching,
    isFormVisible,
    productsCountText,
    refreshProducts
  } = useProductsTab();

  const handleBulkImport = async (products: Omit<Product, 'id'>[]) => {
    setIsBulkImporting(true);
    try {
      const { data, error } = await apiRequest('/api/admin/product/bulk', {
        method: 'POST',
        body: { products },
        showLoadingBar: true
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
          {isSearching ? (
            <div className="flex items-center space-x-2 text-luxury-gray">
              <Search size={16} className="animate-pulse" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : (
            <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
              {productsCountText}
            </p>
          )}
          <Select value={sortOption.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="first-updated">First Updated</SelectItem>
              <SelectItem value="last-updated">Last Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AdminProductGrid />

      {isFormVisible && (
        <AdminProductForm />
      )}

      {showBulkImport && isLoaded && (
        <BulkImportModal
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
