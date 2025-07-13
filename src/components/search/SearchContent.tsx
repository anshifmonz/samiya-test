import React from 'react';
import { type Product, type ProductFilters } from 'types/product';
import { type Category } from 'types/category';
import FilterPanel from './FilterPanel';
import ProductsGrid from './ProductsGrid';
import MobileFilterPanel from './MobileFilterPanel';

interface SearchContentProps {
  products: Omit<Product, 'description'>[];
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Category[];
  query?: string;
  filters: ProductFilters;
}

const SearchContent: React.FC<SearchContentProps> = ({ products, onFiltersChange, categories, query, filters }) => {
  // collect all unique colors from the current products
  const colorSet = new Set<string>();
  products.forEach(product => {
    if (product.images) {
      Object.keys(product.images).forEach((color: string) => colorSet.add(color));
    }
  });
  const availableColors = Array.from(colorSet);

  // collect all unique categories from the current products and count products per category
  const categoryCountMap = new Map<string, number>();
  products.forEach(product => {
    if (product.category) {
      categoryCountMap.set(product.category, (categoryCountMap.get(product.category) || 0) + 1);
    }
  });
  const availableCategories = Array.from(categoryCountMap.keys());

  // collect all unique tags from the current products
  const tagSet = new Set<string>();
  products.forEach(product => {
    if (product.tags) {
      product.tags.forEach((tag: string) => tagSet.add(tag));
    }
  });
  const availableTags = Array.from(tagSet);

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <FilterPanel
          onFiltersChange={onFiltersChange}
          availableColors={availableColors}
          availableCategories={availableCategories}
          availableTags={availableTags}
          categories={categories}
          categoryCountMap={categoryCountMap}
        />
      </div>

      <div className="flex-1">
        {/* Mobile filter panel integrated in main content */}
        <div className="lg:hidden px-3 sm:px-5 pt-6">
          <MobileFilterPanel
            onFiltersChange={onFiltersChange}
            availableColors={availableColors}
            availableCategories={availableCategories}
            availableTags={availableTags}
            categories={categories}
            categoryCountMap={categoryCountMap}
          />
        </div>

        <ProductsGrid products={products} query={query} filters={filters} />
      </div>
    </div>
  );
};

export default SearchContent;
