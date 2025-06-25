import React from 'react';
import { Product } from '../../data/products';
import FilterPanel from './FilterPanel';
import ProductsGrid from './ProductsGrid';

interface SearchContentProps {
  products: Product[];
  onFiltersChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    tags?: string[];
  }) => void;
}

const SearchContent: React.FC<SearchContentProps> = ({ products, onFiltersChange }) => {
  // Collect all unique colors from the current products
  const colorSet = new Set<string>();
  products.forEach(product => {
    if (product.images) {
      Object.keys(product.images).forEach((color: string) => colorSet.add(color));
    }
  });
  const availableColors = Array.from(colorSet);

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <FilterPanel onFiltersChange={onFiltersChange} availableColors={availableColors} />
      <ProductsGrid products={products} />
    </div>
  );
};

export default SearchContent;
