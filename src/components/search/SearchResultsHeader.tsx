import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';

interface SearchResultsHeaderProps {
  productCount: number;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ productCount }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Search Results</h1>
        <p className="text-sm sm:text-lg text-muted-foreground">Showing 1-{Math.min(productCount, 12)} of {productCount} products</p>
      </div>

      <Select defaultValue="relevance">
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Customer Rating</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchResultsHeader;
