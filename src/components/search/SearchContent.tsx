'use client';

import FilterPanel from './FilterPanel';
import ProductsGrid from './ProductsGrid';
import MobileFilterPanel from './MobileFilterPanel';

const SearchContent: React.FC = () => {
  return (
    <div className="flex">
      <FilterPanel />
      <div className="flex-1">
        <MobileFilterPanel />
        <ProductsGrid />
      </div>
    </div>
  );
};

export default SearchContent;
