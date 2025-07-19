'use client';

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
  // collect all unique colors from the current products with their hex codes
  const colorMap = new Map<string, string>();
  products.forEach(product => {
    if (product.images) {
      Object.entries(product.images).forEach(([colorName, colorData]) => {
        if (colorData.hex && colorData.hex !== '######') {
          colorMap.set(colorName, colorData.hex);
        }
      });
    }
  });
  const availableColors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));

  const categoryCountMap = new Map<string, number>();
  products.forEach(product => {
    if (product.categoryId) {
      categoryCountMap.set(product.categoryId, (categoryCountMap.get(product.categoryId) || 0) + 1);
    }
  });
  const availableCategories = Array.from(categoryCountMap.keys());

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
