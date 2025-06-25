import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, Product } from '../data/products';
import Navigation from '../components/shared/Navigation';
import SearchResultsHeader from '../components/search/SearchResultsHeader';
import SearchContent from '../components/search/SearchContent';
import LoadingSpinner from '../components/search/LoadingSpinner';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <SearchResultsHeader query={q} productCount={products.length} />
        <SearchContent products={products} onFiltersChange={handleFiltersChange} />
      </div>
    </div>
  );
};

export default SearchPage;
