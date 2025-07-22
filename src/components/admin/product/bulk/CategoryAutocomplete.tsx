import React, { useState, useRef, useEffect } from 'react';
import { type Category } from 'types/category';
import { useCategorySuggestions, type CategorySuggestion } from './hooks/useCategorySuggestions';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { parseInput, hasSubcategories } from './utils/categoryParser';
import { CategoryInput } from './components/CategoryInput';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';

interface CategoryAutocompleteProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoCloseOnSelect?: boolean;
}

const CategoryAutocomplete: React.FC<CategoryAutocompleteProps> = ({
  categories,
  value,
  onChange,
  onSelect,
  placeholder = "Type to search categories...",
  className = "",
  disabled = false,
  autoCloseOnSelect = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestions = useCategorySuggestions(value, categories);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleSuggestionSelect = (suggestion: CategorySuggestion) => {
    const { segments, isComplete } = parseInput(value);

    let newValue: string;
    if (isComplete || segments.length === 0) {
      newValue = suggestion.pathText;
    } else {
      const newSegments = [...segments, suggestion.category.name];
      newValue = newSegments.join(' > ');
    }

    onChange(newValue);

    const hasChildren = hasSubcategories(suggestion.category, categories);
    const isFinalSelection = !hasChildren || suggestion.isPartialMatch;

    if (isFinalSelection && onSelect) {
      onSelect(newValue);
    }

    if (autoCloseOnSelect && isFinalSelection) {
      setIsOpen(false);
      setHighlightedIndex(0);
    } else if (!hasChildren) {
      setIsOpen(false);
      setHighlightedIndex(0);
    } else {
      // For categories with children, keep dropdown open and update the input
      // to show the selected category, ready for user to type " > " for subcategories
      setHighlightedIndex(0);
    }

    // Keep focus on input to allow continued typing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  // Handle mouse events to prevent premature closing
  const handleSuggestionMouseDown = (e: React.MouseEvent) => {
    // Prevent input blur when clicking on suggestions
    e.preventDefault();
  };

  // Keyboard navigation using custom hook
  const { handleKeyDown } = useKeyboardNavigation({
    isOpen,
    suggestions,
    highlightedIndex,
    setHighlightedIndex,
    setIsOpen,
    onSuggestionSelect: handleSuggestionSelect
  });

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <CategoryInput
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        isOpen={isOpen}
      />

      {isOpen && (
        <SuggestionsDropdown
          ref={listRef}
          suggestions={suggestions}
          highlightedIndex={highlightedIndex}
          categories={categories}
          value={value}
          onSuggestionSelect={handleSuggestionSelect}
          onMouseDown={handleSuggestionMouseDown}
        />
      )}
    </div>
  );
};

export default CategoryAutocomplete;
