import React from 'react';
import { type Product, type ProductFilters } from '@/types/product';
import { type Category } from '@/types/category';
import FilterPanel from './FilterPanel';
import ProductsGrid from './ProductsGrid';
import MobileFilterPanel from './MobileFilterPanel';

interface SearchContentProps {
  products: Product[];
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Category[];
}

const SearchContent: React.FC<SearchContentProps> = ({ products, onFiltersChange, categories }) => {
  // collect all unique colors from the current products
  const colorSet = new Set<string>();
  products.forEach(product => {
    if (product.images) {
      Object.keys(product.images).forEach((color: string) => colorSet.add(color));
    }
  });
  const availableColors = Array.from(colorSet);

  // collect all unique categories from the current products
  const categorySet = new Set<string>();
  products.forEach(product => {
    if (product.category) {
      categorySet.add(product.category);
    }
  });
  const availableCategories = Array.from(categorySet);

  // collect all unique tags from the current products
  const tagSet = new Set<string>();
  products.forEach(product => {
    if (product.tags) {
      product.tags.forEach((tag: string) => tagSet.add(tag));
    }
  });
  const availableTags = Array.from(tagSet);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="hidden lg:block">
        <FilterPanel
          onFiltersChange={onFiltersChange}
          availableColors={availableColors}
          availableCategories={availableCategories}
          availableTags={availableTags}
          categories={categories}
        />
      </div>

      <div className="lg:hidden">
        <MobileFilterPanel
          onFiltersChange={onFiltersChange}
          availableColors={availableColors}
          availableCategories={availableCategories}
          availableTags={availableTags}
          categories={categories}
        />
      </div>

      <ProductsGrid products={products} />
    </div>
  );
};

export default SearchContent;
