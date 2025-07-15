"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearch?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="w-full px-4 py-2 pr-16 luxury-body text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 bg-white text-black placeholder-gray-500 border border-gray-200 focus:border-luxury-gold/50"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-md"
        >
          <Search size={16} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
