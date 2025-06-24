
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts, Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Navigation from '../components/Navigation';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    if (q) {
      setLoading(true);
      const results = searchProducts(q, filters);
      setProducts(results);
      setLoading(false);
    }
  }, [q, filters]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-light">Searching products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-rose-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              <span 
                className="text-rose-600 cursor-pointer hover:text-rose-700 transition-colors"
                onClick={() => navigate('/')}
              >
                Samiya Wedding Center
              </span>
            </h1>
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-lg">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Search Results for "{q}"
          </h2>
          <p className="text-gray-600 mt-1 font-light">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <div className="lg:w-1/4">
            <div className="sticky top-6">
              <FilterPanel onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-rose-300 text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">
                  No products found
                </h3>
                <p className="text-gray-600 mb-8 font-light text-lg">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
