
import React from 'react';
import { Search } from 'lucide-react';

interface AdminSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative">
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by name, ID, category, or tags..."
          className="w-full px-4 py-3 pr-12 luxury-body text-sm rounded-xl bg-white/95 text-luxury-black placeholder-luxury-gray/60 border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 shadow-sm"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-luxury-gray/60">
          <Search size={18} />
        </div>
      </div>
    </div>
  );
};

export default AdminSearchBar;
