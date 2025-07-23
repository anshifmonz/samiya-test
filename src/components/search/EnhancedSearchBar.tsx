'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchWithLoadingBar } from 'hooks/search/useSearchWithLoadingBar';
import { useNextLoadingBar } from 'components/shared/NextLoadingBar';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'product' | 'category';
  url: string;
}

interface EnhancedSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  className?: string;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  placeholder = "Search for products, categories...",
  showSuggestions = true,
  className = "",
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions_, setShowSuggestions_] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchRequest } = useSearchWithLoadingBar();
  const { startLoading } = useNextLoadingBar();

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const urlQuery = searchParams?.get('q') || '';
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !showSuggestions) {
      setSuggestions([]);
      setShowSuggestions_(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const result = await searchRequest(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`, {
        loadingBarDelay: 100,
        showErrorToast: false,
      });

      if (result.data) {
        const productSuggestions: SearchSuggestion[] = (result.data as any[]).slice(0, 5).map((product: any) => ({
          id: product.id,
          title: product.title,
          type: 'product' as const,
          url: `/product/${product.id}`,
        }));

        setSuggestions(productSuggestions);
        setShowSuggestions_(productSuggestions.length > 0);
      }
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions_(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [searchRequest, showSuggestions]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestionIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  }, [fetchSuggestions]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions_(false);
    startLoading();

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onSearch?.(query.trim());
  }, [query, router, startLoading, onSearch]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions_(false);
    startLoading();

    router.push(suggestion.url);
  }, [router, startLoading]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions_ || suggestions.length === 0) {
      if (e.key === 'Escape') {
        setShowSuggestions_(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions_(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions_, suggestions, selectedSuggestionIndex, handleSuggestionClick, handleSubmit]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions_(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node))
        setShowSuggestions_(false);
    };

    if (showSuggestions_)
      document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions_]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions_(true);
              }
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-20 luxury-body text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 bg-white text-black placeholder-gray-500 border border-gray-200 focus:border-red-500/50 shadow-sm"
            autoComplete="off"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
            >
              <X size={16} />
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoadingSuggestions ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </button>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions_ && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                index === selectedSuggestionIndex ? 'bg-red-50 border-red-100' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Search size={14} className="text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-900 font-medium">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {suggestion.type}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
