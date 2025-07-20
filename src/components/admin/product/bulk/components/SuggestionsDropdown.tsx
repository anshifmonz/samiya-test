import React, { forwardRef } from 'react';
import { type Category } from 'types/category';
import { type CategorySuggestion } from '../hooks/useCategorySuggestions';
import { hasSubcategories } from '../utils/categoryParser';
import { SuggestionItem } from './SuggestionItem';
import { CategoryHelpText } from './CategoryHelpText';

interface SuggestionsDropdownProps {
  suggestions: CategorySuggestion[];
  highlightedIndex: number;
  categories: Category[];
  value: string;
  onSuggestionSelect: (suggestion: CategorySuggestion) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Dropdown component containing all suggestions and help text
 */
export const SuggestionsDropdown = forwardRef<HTMLUListElement, SuggestionsDropdownProps>(
  ({ suggestions, highlightedIndex, categories, value, onSuggestionSelect, onMouseDown }, ref) => {
    if (suggestions.length === 0) return null;

    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-luxury-gray/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        <ul ref={ref} className="py-1">
          {suggestions.map((suggestion, index) => {
            const isHighlighted = index === highlightedIndex;
            const hasChildren = hasSubcategories(suggestion.category, categories);

            return (
              <SuggestionItem
                key={suggestion.category.id}
                suggestion={suggestion}
                isHighlighted={isHighlighted}
                hasChildren={hasChildren}
                onMouseDown={onMouseDown}
                onClick={() => onSuggestionSelect(suggestion)}
              />
            );
          })}
        </ul>
        
        <CategoryHelpText
          value={value}
          suggestions={suggestions}
          categories={categories}
        />
      </div>
    );
  }
);

SuggestionsDropdown.displayName = 'SuggestionsDropdown';
