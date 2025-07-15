import SearchBar from '../../search/SearchBar';

interface MobileSearchProps {
  isMobileSearchOpen: boolean;
  mobileSearchRef: React.RefObject<HTMLDivElement>;
  onSearch?: () => void;
}

const MobileSearch: React.FC<MobileSearchProps> = ({ isMobileSearchOpen, mobileSearchRef, onSearch }) => {
  return (
    <div
      ref={mobileSearchRef}
      className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="py-4 border-t border-[#d6c6ae]/30">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};

export default MobileSearch;
