import React from 'react';

interface SearchResultsHeaderProps {
  query: string;
  productCount: number;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ query, productCount }) => {
  return (
    <div className="mb-12">
      <div className="animate-fade-in-up">
        <h2 className="luxury-heading text-4xl sm:text-5xl text-luxury-black mb-4">
          Search Results
        </h2>
        <p className="luxury-body text-xl text-luxury-gray mb-2">
          "{query}"
        </p>
        <p className="luxury-subheading text-luxury-gold text-lg tracking-wider">
          {productCount} product{productCount !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
