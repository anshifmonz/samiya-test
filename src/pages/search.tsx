
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts, Product } from '../data/products';
import Navigation from '../components/shared/Navigation';
import SearchResultsHeader from '../components/search/SearchResultsHeader';
import SearchContent from '../components/search/SearchContent';
import LoadingSpinner from '../components/search/LoadingSpinner';

interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});

  useEffect(() => {
    if (q.trim() === '') {
      navigate('/', { replace: true });
      return;
    }
    setLoading(true);
    const results = searchProducts(q, filters);
    setProducts(results);
    setLoading(false);
  }, [q, filters, navigate]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <SearchResultsHeader query={q} productCount={products.length} />
        <SearchContent products={products} onFiltersChange={handleFiltersChange} />
      </div>
    </div>
  );
};

export default SearchPage;
