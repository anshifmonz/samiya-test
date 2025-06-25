import React from 'react';
import { Product } from '../../data/products';
import FilterPanel from './FilterPanel';
import ProductsGrid from './ProductsGrid';

interface SearchContentProps {
  products: Product[];
  onFiltersChange: (filters: any) => void;
}

const SearchContent: React.FC<SearchContentProps> = ({ products, onFiltersChange }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <FilterPanel onFiltersChange={onFiltersChange} />
      <ProductsGrid products={products} />
    </div>
  );
};

export default SearchContent;
