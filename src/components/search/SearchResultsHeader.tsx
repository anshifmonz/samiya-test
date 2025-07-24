'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';

interface SearchResultsHeaderProps {
  productCount: number;
  totalCount: number;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ productCount, totalCount, sortOrder, onSortChange }) => {
  const getDisplayText = () => {
    if (productCount === 0) {
      return "No products found";
    }

    if (productCount >= totalCount) {
      return `Showing all ${totalCount} product${totalCount !== 1 ? 's' : ''}`;
    }

    return `Showing ${productCount} of ${totalCount} product${totalCount !== 1 ? 's' : ''}`;
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Search Results</h1>
        <p className="text-sm sm:text-lg text-muted-foreground">{getDisplayText()}</p>
      </div>

      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchResultsHeader;
