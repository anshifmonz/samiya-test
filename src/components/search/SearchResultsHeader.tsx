import React from 'react';

interface SearchResultsHeaderProps {
  query: string;
  productCount: number;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ query, productCount }) => {
  return (
    <div className="mb-12">
      <div className="animate-fade-in-up">
        <h2 className="luxury-heading text-2xl sm:text-3xl text-luxury-black mb-2">
          Search Results for "{query}"
        </h2>
        <p className="luxury-subheading text-luxury-gold text-lg tracking-wider">
          {productCount} product{productCount !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
