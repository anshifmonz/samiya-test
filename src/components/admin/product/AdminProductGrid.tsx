import { FC } from 'react';
import ProductCard from 'components/shared/ProductCard';
import { useProductsTab } from 'contexts/admin/ProductsTabContext';
import { useCurrentAdmin } from 'contexts/admin/AdminDashboardContext';

const AdminProductGrid: FC = () => {
  const { products, loading, hasMore, error, isSearching, loaderRef, handleDeleteProduct, handleStartEditing } = useProductsTab();
  const { admin, isSuperAdmin } = useCurrentAdmin();

  if (products.length === 0 && !loading && !isSearching) {
    return (
      <div className="text-center py-16">
        <div className="luxury-card rounded-2xl p-12 max-w-md mx-auto">
          <h3 className="luxury-heading text-xl text-luxury-black mb-4">No products found</h3>
          <p className="luxury-body text-luxury-gray">
            {error ? error : 'Try adjusting your search criteria or add a new product.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid xs:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={true}
            onEdit={handleStartEditing}
            onDelete={isSuperAdmin || admin?.role === 'admin' ? handleDeleteProduct : undefined}
            showTags={true}
          />
        ))}
      </div>

      {(loading || hasMore) && (
        <div
          ref={loaderRef}
          className="flex justify-center items-center py-8"
        >
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-gold"></div>
              <span className="luxury-body text-luxury-gray">
                {isSearching ? 'Searching products...' : 'Loading more products...'}
              </span>
            </div>
          )}
        </div>
      )}

      {error && products.length > 0 && (
        <div className="text-center py-4">
          <p className="luxury-body text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AdminProductGrid;
