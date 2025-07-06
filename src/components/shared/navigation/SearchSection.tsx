import SearchBar from '../../search/SearchBar';

interface SearchSectionProps {
  toggleMobileSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ toggleMobileSearch }) => {
  return (
    <div className="flex items-center">
      {/* Desktop Search Bar */}
      <div className="hidden md:block w-44 md:w-56 lg:w-64">
        <SearchBar />
      </div>

      {/* Mobile Search Icon/Bar */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileSearch}
          className={`transition-colors duration-300 text-black p-2`}
          aria-label="Toggle mobile search"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
