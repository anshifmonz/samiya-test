import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // different styling for search page vs landing page
  const isInNavbar = isSearchPage;

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className={`w-full px-4 py-2 pr-16 luxury-body text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 ${
            isInNavbar
              ? 'bg-white/95 text-luxury-black placeholder-luxury-gray/60 border border-white/20 focus:border-luxury-gold/30'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 group-hover:bg-white/15 group-hover:border-white/30'
          }`}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-luxury-gold text-luxury-black p-1.5 rounded-lg hover:bg-luxury-gold-light transition-all duration-300 hover:scale-105 shadow-md"
        >
          <Search size={16} />
        </button>

        {!isInNavbar && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-luxury-gold/10 via-transparent to-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
